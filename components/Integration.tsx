
import React from 'react';

const phpCode = `
<?php
/**
 * Plugin Name: Annapoorna Exam App SSO & Login
 * Description: Handles SSO and provides a login form shortcode for the React examination app.
 * Version: 2.0
 */

// Note: This requires the firebase/php-jwt library.
// You must install it in your WordPress project, for example using Composer:
// composer require firebase/php-jwt

// IMPORTANT: You must also define a secure, secret key in your wp-config.php file.
// Example: define('JWT_SECRET_KEY', 'your-very-long-and-random-secret-key');

/**
 * Returns the correct base URL for the examination app.
 * Change the URL here when you need to switch between production and testing.
 */
function get_exam_app_base_url() {
    // PRODUCTION URL (Live site)
    return 'https://exams.coding-online.net/';

    // TEST URL (Vercel) - Uncomment this line and comment out the one above for testing.
    // return 'https://mco-exam-jkfzdt3bj-manoj-balakrishnans-projects-aa177a85.vercel.app/';
}

// Mapping of WooCommerce Product Slugs to the Exam IDs used in the React app.
function get_exam_id_map() {
    return [
        'cpc-certification-exam' => 'exam-cpc-cert',
        'cca-certification-exam' => 'exam-cca-cert',
        'ccs-certification-exam' => 'exam-ccs-cert',
        'medical-billing-certification' => 'exam-billing-cert',
        'risk-adjustment-coding-certification' => 'exam-risk-cert',
        'icd-10-cm-certification-exam' => 'exam-icd-cert',
        'cpb-certification-exam' => 'exam-cpb-cert',
        'crc-certification-exam' => 'exam-crc-cert',
        'cpma-certification-exam' => 'exam-cpma-cert',
        'coc-certification-exam' => 'exam-coc-cert',
        'cic-certification-exam' => 'exam-cic-cert',
        'medical-terminology-anatomy-certification' => 'exam-mta-cert',
    ];
}

/**
 * Main SSO function: Generates a JWT and redirects the user after they log in.
 */
function sso_redirect_after_login($user_login, $user) {
    // Admins get redirected to the standard WordPress dashboard, not the exam app.
    if (in_array('administrator', (array) $user->roles)) {
        wp_redirect(admin_url());
        exit;
    }

    // Check if the JWT secret key is defined in wp-config.php.
    if (!defined('JWT_SECRET_KEY')) {
        // You could add an error message here for admins if needed.
        return;
    }

    $user_id = $user->ID;
    $user_data = get_userdata($user_id);
    
    // Find out which exams the user has purchased via WooCommerce.
    $paid_exam_ids = [];
    if (function_exists('wc_customer_bought_product')) {
        $exam_map = get_exam_id_map();
        foreach ($exam_map as $product_slug => $exam_id) {
            // Find the product ID from its slug.
            $product_posts = get_posts([
                'name' => $product_slug, 
                'post_type' => 'product', 
                'numberposts' => 1, 
                'post_status' => 'publish'
            ]);
            if (!empty($product_posts)) {
                $product_id = $product_posts[0]->ID;
                if (wc_customer_bought_product($user->user_email, $user_id, $product_id)) {
                    $paid_exam_ids[] = $exam_id;
                }
            }
        }
    }

    // Create the user's full name from their profile fields.
    $first_name = get_user_meta($user_id, 'first_name', true);
    $last_name = get_user_meta($user_id, 'last_name', true);
    $full_name = trim($first_name . ' ' . $last_name);
    if (empty($full_name)) {
        $full_name = $user_data->display_name;
    }

    // Build the JWT payload. This must match what the React app expects.
    $payload = [
        'iss' => get_site_url(),
        'iat' => time(),
        'exp' => time() + (60 * 60), // Token is valid for 1 hour.
        'user' => [
            'id'      => (string) $user_id,
            'name'    => $full_name,
            'email'   => $user_data->user_email,
            'isAdmin' => in_array('administrator', (array) $user->roles),
        ],
        'paidExamIds' => $paid_exam_ids,
    ];

    // Encode the JWT. Using the fully qualified class name is safer with snippet plugins.
    $jwt = \\Firebase\\JWT\\JWT::encode($payload, JWT_SECRET_KEY, 'HS256');
    
    // Build the final redirect URL.
    $app_base_url = get_exam_app_base_url();
    $app_auth_url = $app_base_url . '#/auth';
    $final_redirect_url = add_query_arg('token', $jwt, $app_auth_url);
    
    // If the user was trying to go somewhere specific (like a practice test), preserve that redirect.
    if (isset($_REQUEST['redirect_to']) && !empty($_REQUEST['redirect_to'])) {
       $final_destination = sanitize_text_field(wp_unslash($_REQUEST['redirect_to']));
       // Make sure we're not redirecting back to the login page itself.
       if (strpos($final_destination, 'wp-login') === false && strpos($final_destination, 'exam-login') === false) {
           $final_redirect_url = add_query_arg('redirect_to', urlencode($final_destination), $final_redirect_url);
       }
    }
    
    wp_redirect($final_redirect_url);
    exit;
}
add_action('wp_login', 'sso_redirect_after_login', 10, 2);

/**
 * Shortcode handler for [exam_login_form] to display a login form on any page.
 */
function exam_login_form_shortcode_handler() {
    ob_start();

    if (is_user_logged_in()) {
        $current_user = wp_get_current_user();
        echo '<div class="exam-login-container" style="padding: 20px; border: 1px solid #ddd; border-radius: 5px; text-align: center;">';
        echo '<h3>Welcome, ' . esc_html($current_user->display_name) . '!</h3>';
        echo '<p>You are already logged in. Click below to sync your exams and go to your dashboard.</p>';
        
        $app_base_url = get_exam_app_base_url();
        // The destination within the React app.
        $dashboard_path = '#/dashboard';
        // We still use wp_login_url to trigger the sso_redirect_after_login hook which generates a fresh JWT.
        $sync_url = wp_login_url($app_base_url . $dashboard_path);
        
        echo '<a href="' . esc_url($sync_url) . '" class="button" style="display: inline-block; padding: 10px 20px; background-color: #0073aa; color: white; text-decoration: none; border-radius: 3px;">Go to Dashboard</a>';
        echo '</div>';
    } else {
        // Where to return after login. Default to the current page.
        $redirect_url = home_url($_SERVER['REQUEST_URI']);
        echo '<div class="exam-login-container">';
        wp_login_form([
            'redirect'       => $redirect_url,
            'label_username' => 'Username or Email Address',
            'label_password' => 'Password',
            'label_log_in'   => 'Log In to Exam Portal',
            'remember'       => true
        ]);
        // Use double quotes to avoid issues with the apostrophe.
        echo "<p style='text-align:center; margin-top:1em;'>Don\\'t have an account? <a href='" . esc_url(wp_registration_url()) . "'>Register here</a>.</p>";
        echo '</div>';
    }

    return ob_get_clean();
}
add_shortcode('exam_login_form', 'exam_login_form_shortcode_handler');
?>
`;

const Integration = () => {
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">WordPress Integration Guide</h1>
            <p className="text-slate-600 mb-6">
                To enable Single Sign-On (SSO) and a custom login shortcode, add the following PHP code to your WordPress theme's <code>functions.php</code> file or use a code snippets plugin.
            </p>

            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">Step 1: Install JWT Library</h2>
                    <p className="text-slate-600 mb-2">
                        This integration requires the <code>firebase/php-jwt</code> library. If you use Composer, run this command in your WordPress project root:
                    </p>
                    <pre className="bg-slate-800 text-white p-4 rounded-lg overflow-x-auto">
                        <code>composer require firebase/php-jwt</code>
                    </pre>
                     <p className="text-slate-500 text-sm mt-2">
                        If you do not use Composer, you will need to download the library and include it manually.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">Step 2: Define a Secret Key</h2>
                    <p className="text-slate-600 mb-2">
                        For security, add a unique secret key to your <code>wp-config.php</code> file. This key is used to sign the login tokens.
                    </p>
                    <pre className="bg-slate-800 text-white p-4 rounded-lg overflow-x-auto">
                        <code>define('JWT_SECRET_KEY', 'your-super-secret-key-that-is-long-and-random');</code>
                    </pre>
                </div>
                
                <div>
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">Step 3: Add Full Code to WordPress</h2>
                    <p className="text-slate-600 mb-2">
                        Copy the entire code block below and paste it into your active WordPress theme's <code>functions.php</code> file.
                    </p>
                    <pre className="bg-slate-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{phpCode}</code>
                    </pre>
                </div>
                 <div>
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">Step 4: Use the Features</h2>
                    <p className="text-slate-600 mb-2">
                       Once the code is added, two features are enabled:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-2 text-slate-600">
                        <li>
                            <strong>Login Shortcode:</strong> Create a new page (e.g., "Exam Login") and add the shortcode <code>[exam_login_form]</code> to its content to display a login form.
                        </li>
                         <li>
                            <strong>Environment Switching:</strong> To switch between the Production and Test versions of the app, simply edit the <code>get_exam_app_base_url</code> function within the PHP code you just pasted.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Integration;
