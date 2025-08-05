
import React from 'react';

const phpCode = `
<?php
/**
 * Plugin Name: Annapoorna Custom Exam Login
 * Description: Provides a self-contained, dependency-free shortcode [exam_portal_login] for a custom login form that generates a JWT for the React exam app.
 * Version: 3.0
 */

// --- CONFIGURATION ---
// IMPORTANT: You must define a secure, secret key in your wp-config.php file. This is REQUIRED.
// Example: define('EXAM_APP_JWT_SECRET', 'your-very-long-and-random-secret-key-goes-here');

// Base URL for your React exam app. Change the active line to switch between test and production.
define('EXAM_APP_URL', 'https://exams.coding-online.net/'); // PRODUCTION
// define('EXAM_APP_URL', 'https://mco-exam-jkfzdt3bj-manoj-balakrishnans-projects-aa177a85.vercel.app/'); // VERCEL/TEST
// --- END CONFIGURATION ---

/**
 * Encodes data with base64url format, which is safe for URLs.
 */
function exam_app_base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

/**
 * Generates a secure JWT for the exam portal using a manual implementation.
 * This avoids the need for external libraries, preventing activation errors.
 */
function exam_app_generate_jwt($user_id) {
    if (!defined('EXAM_APP_JWT_SECRET')) { return null; }
    $secret_key = EXAM_APP_JWT_SECRET;
    
    $user = get_userdata($user_id);
    if (!$user) return null;

    // Determine the user's full name for the certificate
    $user_full_name = get_user_meta($user_id, '_exam_portal_full_name', true);
    if (empty($user_full_name)) { $user_full_name = trim($user->first_name . ' ' . $user->last_name); }
    if (empty($user_full_name)) { $user_full_name = $user->display_name; }

    // Get purchased exam IDs from WooCommerce completed orders
    $paid_exam_ids = [];
    if (class_exists('WooCommerce')) {
        $exam_map = [
            'cpc-certification-exam' => 'exam-cpc-cert', 'cca-certification-exam' => 'exam-cca-cert',
            'ccs-certification-exam' => 'exam-ccs-cert', 'medical-billing-certification' => 'exam-billing-cert',
            'risk-adjustment-coding-certification' => 'exam-risk-cert', 'icd-10-cm-certification-exam' => 'exam-icd-cert',
            'cpb-certification-exam' => 'exam-cpb-cert', 'crc-certification-exam' => 'exam-crc-cert',
            'cpma-certification-exam' => 'exam-cpma-cert', 'coc-certification-exam' => 'exam-coc-cert',
            'cic-certification-exam' => 'exam-cic-cert', 'medical-terminology-anatomy-certification' => 'exam-mta-cert',
        ];

        try {
            $orders = wc_get_orders(['customer_id' => $user->ID, 'status' => 'completed', 'limit' => -1]);
            if ($orders) {
                foreach ($orders as $order) {
                    foreach ($order->get_items() as $item) {
                        if ($product = $item->get_product()) {
                            if ($sku = $product->get_sku()) { // Prioritize SKU
                                if (isset($exam_map[$sku])) $paid_exam_ids[] = $exam_map[$sku];
                            } elseif ($slug = $product->get_slug()) { // Fallback to slug
                                if (isset($exam_map[$slug])) $paid_exam_ids[] = $exam_map[$slug];
                            }
                        }
                    }
                }
            }
        } catch (Exception $e) { /* WooCommerce not active or error, do nothing */ }
    }
    
    $payload = [
        'iss' => get_site_url(),
        'iat' => time(),
        'exp' => time() + (60 * 60 * 2), // Token is valid for 2 hours
        'user' => [
            'id' => (string)$user->ID, 
            'name' => $user_full_name, 
            'email' => $user->user_email,
            'isAdmin' => in_array('administrator', (array) $user->roles)
        ], 
        'paidExamIds' => array_unique($paid_exam_ids)
    ];

    $header_json = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload_json = json_encode($payload);

    $base64UrlHeader = exam_app_base64url_encode($header_json);
    $base64UrlPayload = exam_app_base64url_encode($payload_json);

    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret_key, true);
    $base64UrlSignature = exam_app_base64url_encode($signature);

    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

/**
 * Shortcode handler for [exam_portal_login] to display a custom login form.
 */
function exam_portal_login_shortcode_handler() {
    $login_error = '';
    
    // Default redirect is to the app's dashboard
    $redirect_to = isset($_GET['redirect_to']) ? esc_url_raw(urldecode($_GET['redirect_to'])) : '/dashboard';

    // Handle form submission
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['exam_login_nonce']) && wp_verify_nonce($_POST['exam_login_nonce'], 'exam_login_action')) {
        $user = wp_authenticate(sanitize_user($_POST['log']), $_POST['pwd']);
        if (is_wp_error($user)) {
            $login_error = 'Invalid username or password.';
        } else {
            // Save the full name for the certificate to user meta
            if (!empty($_POST['full_name'])) {
                update_user_meta($user->ID, '_exam_portal_full_name', sanitize_text_field($_POST['full_name']));
            }
            // Log the user in and set cookies
            wp_set_current_user($user->ID);
            wp_set_auth_cookie($user->ID);
            
            // Generate the JWT and redirect
            $token = exam_app_generate_jwt($user->ID);
            if ($token) {
                $final_redirect_url = EXAM_APP_URL . '#/auth?token=' . $token . '&redirect_to=' . urlencode($redirect_to);
                wp_redirect($final_redirect_url);
                exit;
            } else {
                $login_error = 'Could not generate login token. Please contact support.';
            }
        }
    }
    
    ob_start();

    // If user is already logged in, just generate a new token and redirect them.
    if (is_user_logged_in()) {
        $token = exam_app_generate_jwt(get_current_user_id());
        $final_redirect_url = EXAM_APP_URL . '#/auth?token=' . $token . '&redirect_to=' . urlencode($redirect_to);
        echo "<div class='exam-portal-container' style='text-align:center;'><p>You are already logged in. Syncing your exams and redirecting...</p><script>window.location.href = '" . esc_url_raw($final_redirect_url) . "';</script></div>";
    } else {
        // If logged out, show the custom login form.
        $current_user_name = ''; // No user, so name is blank
        ?>
        <style>.exam-portal-container{font-family:sans-serif;max-width:400px;margin:5% auto;padding:40px;background:#fff;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,.1)}.exam-portal-container h2{text-align:center;font-size:24px;margin-bottom:30px}.exam-portal-container .form-row{margin-bottom:20px}.exam-portal-container label{display:block;margin-bottom:8px;font-weight:600;}.exam-portal-container input{width:100%;padding:12px;border:1px solid #ccc;border-radius:8px;box-sizing:border-box}.exam-portal-container button{width:100%;padding:14px;background-color:#0891b2;color:#fff;border:none;border-radius:8px;font-size:16px;cursor:pointer}.exam-portal-links{margin-top:20px;text-align:center}</style>
        <div class="exam-portal-container" id="exam-login-form-container">
            <h2>Exam Portal Login</h2>
            <?php if ($login_error) echo "<p style='color:red;text-align:center;'>". esc_html($login_error) ."</p>"; ?>
            <form name="loginform" id="loginform" action="<?php echo esc_url(add_query_arg('redirect_to', urlencode($redirect_to), '')); ?>" method="post">
                <div class="form-row"><label for="full_name">Full Name (for Certificate)</label><input type="text" name="full_name" id="full_name" required></div>
                <div class="form-row"><label for="log">Username or Email</label><input type="text" name="log" id="log" required></div>
                <div class="form-row"><label for="pwd">Password</label><input type="password" name="pwd" id="pwd" required></div>
                <div class="form-row"><button type="submit">Log In</button></div>
                <?php wp_nonce_field('exam_login_action', 'exam_login_nonce'); ?>
            </form>
            <div class="exam-portal-links"><a href="<?php echo esc_url(wp_registration_url()); ?>">Register</a> | <a href="<?php echo esc_url(wp_lostpassword_url()); ?>">Lost Password?</a></div>
        </div>
        <?php
    }
    return ob_get_clean();
}
add_shortcode('exam_portal_login', 'exam_portal_login_shortcode_handler');
?>
`;

const Integration = () => {
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">WordPress Integration Guide</h1>
            <p className="text-slate-600 mb-6">
                To enable a custom login page and Single Sign-On (SSO), add the following PHP code to your WordPress theme's <code>functions.php</code> file or use a code snippets plugin like "Code Snippets". This version has no external library dependencies.
            </p>

            <div className="space-y-6">
                 <div>
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">Step 1: Define Your Secret Key</h2>
                    <p className="text-slate-600 mb-2">
                        For security, you <strong>must</strong> add a unique secret key to your <code>wp-config.php</code> file. This key is used to sign the login tokens. Use a password generator to create a long, random key.
                    </p>
                    <pre className="bg-slate-800 text-white p-4 rounded-lg overflow-x-auto">
                        <code>define('EXAM_APP_JWT_SECRET', 'your-super-secret-key-that-is-long-and-random');</code>
                    </pre>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">Step 2: Add Full Code to WordPress</h2>
                    <p className="text-slate-600 mb-2">
                        Copy the entire code block below. This single snippet handles everything.
                    </p>
                    <pre className="bg-slate-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{phpCode}</code>
                    </pre>
                </div>
                
                <div>
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">Step 3: Create Login Page & Use Shortcode</h2>
                     <p className="text-slate-600 mb-2">
                       In your WordPress admin dashboard, create a new page (e.g., named "Exam Login" with the slug <code>/exam-login/</code>). In the content editor for that page, add the following shortcode:
                    </p>
                    <pre className="bg-slate-800 text-white p-4 rounded-lg overflow-x-auto">
                        <code>[exam_portal_login]</code>
                    </pre>
                     <p className="text-slate-600 mt-2">
                        This will display the custom login form. The app is already configured to use the <code>/exam-login/</code> URL for all login buttons.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">Step 4: (Optional) Switch Environments</h2>
                    <p className="text-slate-600 mb-2">
                       To switch between your Production and Test app URLs, simply edit the <code>EXAM_APP_URL</code> definition at the top of the PHP code you just pasted.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Integration;
