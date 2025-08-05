
import React from 'react';

const phpCode = `
<?php
/**
 * ===================================================================
 * V13: Integrated Exam Portal Functions (Configurable & Stable)
 * ===================================================================
 * This version makes the login page slug configurable and fixes redirects.
 */

// --- CONFIGURATION ---
// Set the URL slug for your custom login page here.
// Make sure you have a WordPress page with this exact slug.
define('ANNAPOORNA_LOGIN_SLUG', 'exam-login');
define('ANNAPOORNA_EXAM_APP_URL', 'https://exams.coding-online.net/'); // Base URL for your exam app
define('ANNAPOORNA_JWT_SECRET_KEY', 'K7x$4tZ!Gv2#h1wM9uY^eP*8Aq@R5sV%z3Jb0D&fL6N'); // <-- IMPORTANT: REPLACE THIS with a new, strong, random key!
// --- END CONFIGURATION ---


// SECTION 1: CORE PAYLOAD & TOKEN GENERATION
function annapoorna_exam_get_payload($user_id) {
    $user = get_userdata($user_id);
    if (!$user) return null;

    $is_admin = in_array('administrator', (array) $user->roles);

    $user_full_name = get_user_meta($user_id, '_exam_portal_full_name', true);
    if (empty($user_full_name)) { $user_full_name = trim($user->first_name . ' ' . $user->last_name); }
    if (empty($user_full_name)) { $user_full_name = $user->display_name; }
    
    // This part is crucial: It gets the SKUs of completed WooCommerce orders.
    // The SKU must match the 'id' of the certification exams in the React app.
    $paid_exam_ids = [];
    if (class_exists('WooCommerce')) {
        $orders = wc_get_orders(['customer_id' => $user->ID, 'status' => 'completed', 'limit' => -1]);
        if ($orders) {
            foreach ($orders as $order) {
                foreach ($order->get_items() as $item) {
                    if ($sku = $item->get_product()->get_sku()) {
                        if (!in_array($sku, $paid_exam_ids)) $paid_exam_ids[] = $sku;
                    }
                }
            }
        }
    }
    
    return [
        'user' => [
            'id' => (string)$user->ID, 
            'name' => $user_full_name, 
            'email' => $user->user_email,
            'isAdmin' => $is_admin
        ], 
        'paidExamIds' => $paid_exam_ids
    ];
}
// SECTION 1.5: JWT GENERATION & WOOCOMMERCE REDIRECT

/**
 * Encodes data with base64url format.
 */
function annapoorna_base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

/**
 * Generates a secure JWT for the exam portal.
 * This is a manual implementation of JWT.
 */
function annapoorna_generate_exam_jwt($user_id) {
    $secret_key = defined('ANNAPOORNA_JWT_SECRET_KEY') ? ANNAPOORNA_JWT_SECRET_KEY : '';
    if (empty($secret_key) || $secret_key === 'your-very-strong-secret-key') {
        return null;
    }
    
    $payload = annapoorna_exam_get_payload($user_id);
    if (!$payload) return null;

    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload_json = json_encode($payload);

    $base64UrlHeader = annapoorna_base64url_encode($header);
    $base64UrlPayload = annapoorna_base64url_encode($payload_json);

    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret_key, true);
    $base64UrlSignature = annapoorna_base64url_encode($signature);

    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}


/**
 * Redirects the user to the exam portal after a successful WooCommerce purchase.
 */
function annapoorna_redirect_after_purchase($order_id) {
    if (!$order_id) return;
    
    $order = wc_get_order($order_id);
    if (!$order) return;

    $user_id = $order->get_customer_id();

    if ($user_id > 0 && $order->has_status(array('completed', 'processing'))) {
        $token = annapoorna_generate_exam_jwt($user_id);
        if ($token) {
            $redirect_url = ANNAPOORNA_EXAM_APP_URL . '#/auth?token=' . $token . '&redirect_to=/dashboard';
            wp_redirect($redirect_url);
            exit;
        }
    }
}
add_action('woocommerce_thankyou', 'annapoorna_redirect_after_purchase', 10, 1);

// SECTION 2: SHORTCODE FOR CUSTOM LOGIN PORTAL
function annapoorna_exam_login_shortcode() {
    $exam_app_url_base = 'https://exams.coding-online.net/';
    $login_error = '';
    $redirect_to = isset($_GET['redirect_to']) ? esc_url_raw($_GET['redirect_to']) : '/dashboard';

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['exam_login_nonce']) && wp_verify_nonce($_POST['exam_login_nonce'], 'exam_login_action')) {
        $user = wp_authenticate(sanitize_user($_POST['log']), $_POST['pwd']);
        if (is_wp_error($user)) {
            $login_error = 'Invalid username or password.';
			} else {
            update_user_meta($user->ID, '_exam_portal_full_name', sanitize_text_field($_POST['full_name']));
            wp_set_current_user($user->ID);
            wp_set_auth_cookie($user->ID);
            $token = annapoorna_generate_exam_jwt($user->ID);
            $final_redirect_url = ANNAPOORNA_EXAM_APP_URL . '#/auth?token=' . $token . '&redirect_to=' . urlencode($redirect_to);
            wp_redirect($final_redirect_url);
            exit;
        }
    }
    
    ob_start();
    if (is_user_logged_in()) {
        $token = annapoorna_generate_exam_jwt(get_current_user_id());
        $proceed_url = ANNAPOORNA_EXAM_APP_URL . '#/auth?token=' . $token . '&redirect_to=' . urlencode($redirect_to);
        echo "<div class='exam-portal-container' style='text-align:center;'><p>You are already logged in. Redirecting...</p><script>window.location.href = '{$proceed_url}';</script></div>";
    } else {
        ?>
        <style>.exam-portal-container{font-family:sans-serif;max-width:400px;margin:5% auto;padding:40px;background:#fff;border-radius:12px;box-shadow:0 10px 25px -5px rgba(0,0,0,.1)}.exam-portal-container h2{text-align:center;font-size:24px;margin-bottom:30px}.exam-portal-container .form-row{margin-bottom:20px}.exam-portal-container label{display:block;margin-bottom:8px}.exam-portal-container input{width:100%;padding:12px;border:1px solid #ccc;border-radius:8px;box-sizing:border-box}.exam-portal-container button{width:100%;padding:14px;background-color:#0891b2;color:#fff;border:none;border-radius:8px;font-size:16px;cursor:pointer}.exam-portal-links{margin-top:20px;text-align:center}</style>
        <div class="exam-portal-container" id="exam-login-form-container">
            <h2>Exam Portal Login</h2>
            <?php if ($login_error) echo "<p style='color:red;text-align:center;'>{$login_error}</p>"; ?>
            <form name="loginform" id="loginform" action="<?php echo esc_url(add_query_arg('redirect_to', urlencode($redirect_to), '')); ?>" method="post">
                <div class="form-row"><label for="full_name">Full Name (for Certificate)</label><input type="text" name="full_name" required></div>
                <div class="form-row"><label for="log">Username or Email</label><input type="text" name="log" required></div>
                <div class="form-row"><label for="pwd">Password</label><input type="password" name="pwd" required></div>
                <div class="form-row"><button type="submit">Log In</button></div>
                <?php wp_nonce_field('exam_login_action', 'exam_login_nonce'); ?>
            </form>
            <div class="exam-portal-links"><a href="<?php echo esc_url(wp_registration_url()); ?>">Register</a> | <a href="<?php echo esc_url(wp_lostpassword_url()); ?>">Lost Password?</a></div>
        </div>
        <?php
    }
    return ob_get_clean();
}
add_shortcode('exam_portal_login', 'annapoorna_exam_login_shortcode');

// SECTION 3: CUSTOMIZE REGISTRATION & REDIRECTS
function annapoorna_exam_add_custom_registration_fields() {
    ?>
    <p><label for="first_name">First Name<br/><input type="text" name="first_name" required/></label></p>
    <p><label for="last_name">Last Name<br/><input type="text" name="last_name" required/></label></p>
    <p><label for="password">Password<br/><input type="password" name="password" required/></label></p>
    <?php
}
add_action('register_form', 'annapoorna_exam_add_custom_registration_fields');

function annapoorna_exam_validate_reg_fields($errors, $login, $email) {
    if (empty($_POST['first_name']) || empty($_POST['last_name']) || empty($_POST['password'])) {
        $errors->add('field_error', 'All fields, including password, are required.');
    }
    return $errors;
}
add_filter('registration_errors', 'annapoorna_exam_validate_reg_fields', 10, 3);

function annapoorna_exam_save_reg_fields($user_id) {
    update_user_meta($user_id, 'first_name', sanitize_text_field($_POST['first_name']));
    update_user_meta($user_id, 'last_name', sanitize_text_field($_POST['last_name']));
    update_user_meta($user_id, '_exam_portal_full_name', sanitize_text_field($_POST['first_name']) . ' ' . sanitize_text_field($_POST['last_name']));
    wp_set_password($_POST['password'], $user_id);
}
add_action('user_register', 'annapoorna_exam_save_reg_fields');

function annapoorna_exam_autologin_after_register($user_id) {
    wp_set_auth_cookie($user_id);
    set_transient('annapoorna_redirect_after_register_' . $user_id, true, 60);
    wp_redirect(home_url());
    exit;
}
add_action('user_register', 'annapoorna_exam_autologin_after_register');

function annapoorna_exam_check_redirect_on_load() {
    if (is_user_logged_in()) {
        $user_id = get_current_user_id();
        if (get_transient('annapoorna_redirect_after_register_' . $user_id)) {
            delete_transient('annapoorna_redirect_after_register_' . $user_id);
            $token = annapoorna_generate_exam_jwt($user_id);
            $final_redirect_url = ANNAPOORNA_EXAM_APP_URL . '#/auth?token=' . $token . '&redirect_to=/dashboard';
            wp_redirect($final_redirect_url);
            exit;
        }
    }
}
add_action('template_redirect', 'annapoorna_exam_check_redirect_on_load');

function annapoorna_exam_login_url($login_url, $redirect) {
    return home_url(add_query_arg('redirect_to', $redirect, ANNAPOORNA_LOGIN_SLUG));
}
add_filter('login_url', 'annapoorna_exam_login_url', 10, 2);

function annapoorna_exam_logout_redirect() {
    return home_url(ANNAPOORNA_LOGIN_SLUG);
}
add_filter('logout_redirect', 'annapoorna_exam_logout_redirect', 10, 3);

add_action('woocommerce_thankyou', function($order_id) {
  $login_url = home_url(ANNAPOORNA_LOGIN_SLUG);
  echo "<script>window.location.href = '{$login_url}';</script>";
});
?>
`;

const Integration = () => {
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Your WordPress Integration Code</h1>
            <p className="text-slate-600 mb-6">
                This page displays your specific PHP code for enabling Single Sign-On (SSO) from your WordPress site. This code should be placed in your active theme's <code>functions.php</code> file.
            </p>

            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">Key Configuration</h2>
                    <p className="text-slate-600 mb-2">
                        At the top of the code, ensure the following constants are set correctly for your environment:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-4 bg-slate-50 p-4 rounded-md">
                        <li>
                            <strong><code>ANNAPOORNA_LOGIN_SLUG</code></strong>: This must match the URL slug of the page where you place the <code>[exam_portal_login]</code> shortcode.
                        </li>
                        <li>
                            <strong><code>ANNAPOORNA_EXAM_APP_URL</code></strong>: This should be the base URL of this examination application.
                        </li>
                        <li>
                            <strong><code>ANNAPOORNA_JWT_SECRET_KEY</code></strong>: This is the secret key used to sign the tokens. For security, it is critical that you <strong className="text-red-600">replace the default key with your own unique, long, and random string.</strong>
                        </li>
                    </ul>
                </div>
                
                <div>
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">How It Works</h2>
                     <p className="text-slate-600 mb-2">
                        This code creates a custom login experience via a shortcode, handles user registration, and automatically redirects users to the exam app after login or purchase. It identifies purchased exams by matching the <strong>WooCommerce Product SKU</strong> with the <strong>Exam ID</strong> in this application.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">Code for <code>functions.php</code></h2>
                    <p className="text-slate-600 mb-2">
                       This is a complete copy of the code you are using for reference.
                    </p>
                    <pre className="bg-slate-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{phpCode}</code>
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default Integration;
