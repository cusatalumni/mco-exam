
import React from 'react';

const phpCode = `
<?php
/**
 * Plugin Name: Annapoorna Exam App SSO
 * Description: Handles Single Sign-On to the React examination app.
 * Version: 1.1
 */

// Note: This requires the firebase/php-jwt library.
// Install it via composer: composer require firebase/php-jwt

use \\Firebase\\JWT\\JWT;

// IMPORTANT: Define a secure, secret key in your wp-config.php file.
// define('JWT_SECRET_KEY', 'your-super-secret-key-that-is-long-and-random');

// Mapping of WooCommerce Product Slugs to Exam IDs from your React app.
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
 * Main function to generate JWT and redirect upon login.
 * This is hooked into 'wp_login'.
 */
function sso_redirect_after_login($user_login, $user) {
    $user_roles = (array) $user->roles;

    // If the user is an administrator, redirect them to the WP admin dashboard.
    if (in_array('administrator', $user_roles)) {
        wp_redirect(admin_url());
        exit;
    }

    $app_auth_url = 'https://exams.coding-online.net/#/auth';
    $user_id = $user->ID;
    $user_data = get_userdata($user_id);
    
    // Get paid exam IDs from WooCommerce purchases.
    $paid_exam_ids = [];
    $exam_map = get_exam_id_map();
    if (function_exists('wc_customer_bought_product')) {
        foreach ($exam_map as $product_slug => $exam_id) {
            $product_posts = get_posts(['name' => $product_slug, 'post_type' => 'product', 'posts_per_page' => 1, 'post_status' => 'publish']);
            if (!empty($product_posts)) {
                $product_id = $product_posts[0]->ID;
                if (wc_customer_bought_product($user->user_email, $user_id, $product_id)) {
                    $paid_exam_ids[] = $exam_id;
                }
            }
        }
    }

    if (!defined('JWT_SECRET_KEY')) { return; }
    $secret_key = JWT_SECRET_KEY;

    // Construct user's full name for the certificate.
    $first_name = get_user_meta($user_id, 'first_name', true);
    $last_name = get_user_meta($user_id, 'last_name', true);
    $full_name = trim($first_name . ' ' . $last_name);
    if (empty($full_name)) {
        $full_name = $user_data->display_name;
    }

    $payload = [
        'iss' => get_site_url(),
        'iat' => time(),
        'exp' => time() + (60 * 60), // 1 hour expiration
        'user' => [
            'id'      => (string) $user_id,
            'name'    => $full_name,
            'email'   => $user_data->user_email,
            'isAdmin' => false,
        ],
        'paidExamIds' => $paid_exam_ids,
    ];

    $jwt = JWT::encode($payload, $secret_key, 'HS256');
    $final_redirect_url = add_query_arg('token', $jwt, $app_auth_url);
    
    // If a redirect_to parameter exists (e.g., from a deep link), preserve it.
    if (isset($_REQUEST['redirect_to'])) {
       $final_destination = $_REQUEST['redirect_to'];
       $final_redirect_url = add_query_arg('redirect_to', urlencode($final_destination), $final_redirect_url);
    }
    
    wp_redirect($final_redirect_url);
    exit;
}
add_action('wp_login', 'sso_redirect_after_login', 10, 2);

/**
 * Shortcode handler for [exam_login_form].
 * Displays a login form or a welcome message if already logged in.
 */
function exam_login_form_shortcode_handler() {
    ob_start();

    if (is_user_logged_in()) {
        $current_user = wp_get_current_user();
        echo '<div class="exam-login-container" style="padding: 20px; border: 1px solid #ddd; border-radius: 5px; text-align: center;">';
        echo '<h3>Welcome, ' . esc_html($current_user->display_name) . '!</h3>';
        echo '<p>You are already logged in. If you recently purchased a new exam, you can sync your account below.</p>';
        
        // This button triggers the redirect logic again. wp_login_url() is a helper
        // that creates a login link, but since the user is logged in, it just redirects.
        $sync_redirect_url = 'https://exams.coding-online.net/#/dashboard';
        $sync_url = wp_login_url($sync_redirect_url);
        
        echo '<a href="' . esc_url($sync_url) . '" class="button" style="display: inline-block; padding: 10px 20px; background-color: #0073aa; color: white; text-decoration: none; border-radius: 3px;">Sync My Exams & Go to Dashboard</a>';
        echo '</div>';
    } else {
        echo '<div class="exam-login-container">';
        wp_login_form([
            'redirect'       => home_url($_SERVER['REQUEST_URI']), // Redirect back to this page after login
            'label_username' => 'Username or Email Address',
            'label_password' => 'Password',
            'label_log_in'   => 'Log In to Exam Portal',
            'remember'       => true
        ]);
        echo '<p style="text-align:center; margin-top:1em;">Don\\'t have an account? <a href="' . esc_url(wp_registration_url()) . '">Register here</a>.</p>';
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
                To enable Single Sign-On (SSO) from your WordPress site to this examination app, add the following PHP code to your WordPress theme's <code>functions.php</code> file. This creates a shortcode `[exam_login_form]` that you can place on any page to create a login portal.
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
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">Step 2: Define a Secret Key</h2>
                    <p className="text-slate-600 mb-2">
                        Add a unique secret key to your <code>wp-config.php</code> file for security.
                    </p>
                    <pre className="bg-slate-800 text-white p-4 rounded-lg overflow-x-auto">
                        <code>define('JWT_SECRET_KEY', 'your-super-secret-key-that-is-long-and-random');</code>
                    </pre>
                    <p className="text-slate-500 mt-2 text-sm">
                        Replace the placeholder with a long, random string.
                    </p>
                </div>
                
                <div>
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">Step 3: Add to <code>functions.php</code></h2>
                    <p className="text-slate-600 mb-2">
                        Copy the entire code block below and paste it into your active WordPress theme's <code>functions.php</code> file.
                    </p>
                    <pre className="bg-slate-800 text-white p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{phpCode}</code>
                    </pre>
                </div>
                 <div>
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">Step 4: Create Login Page</h2>
                    <p className="text-slate-600 mb-2">
                        In your WordPress admin, create a new page (e.g., "Exam Login"). In the page editor, simply add the following shortcode to the content:
                    </p>
                    <pre className="bg-slate-800 text-white p-4 rounded-lg overflow-x-auto">
                        <code>[exam_login_form]</code>
                    </pre>
                    <p className="text-slate-600 mt-2">
                       Publish the page. Now, when users visit this page, they will see the login form. After they log in, they will be automatically and securely redirected to the exam application.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Integration;
