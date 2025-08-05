
import React from 'react';

const phpCode = `
<?php
// Note: This requires the firebase/php-jwt library.
// Install it via composer: composer require firebase/php-jwt

// IMPORTANT: Define a secure, secret key in your wp-config.php file.
// define('JWT_SECRET_KEY', 'your-super-secret-key-that-is-long-and-random');

use \\Firebase\\JWT\\JWT;

// Mapping of WooCommerce Product Slugs to Exam IDs from your React app.
// Ensure these slugs match your WooCommerce product settings.
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

// Function to generate the JWT and redirect the user
function sso_redirect_after_login($user_login, $user) {
    // The URL of your React examination app's auth callback page
    $app_auth_url = 'https://exams.coding-online.net/#/auth';

    $user_id = $user->ID;
    $user_data = get_userdata($user_id);
    $user_roles = (array) $user_data->roles;

    // Check if the user is an administrator
    $is_admin = in_array('administrator', $user_roles);
    
    // Get paid exam IDs for the user
    $paid_exam_ids = [];
    $exam_map = get_exam_id_map();

    if (function_exists('wc_customer_bought_product') && function_exists('get_page_by_path')) {
        foreach ($exam_map as $product_slug => $exam_id) {
            $product = get_page_by_path($product_slug, OBJECT, 'product');
            // Check if the user has purchased the product corresponding to the exam
            if ($product && wc_customer_bought_product($user->user_email, $user_id, $product->ID)) {
                $paid_exam_ids[] = $exam_id;
            }
        }
    }

    // Define the JWT secret key
    if (!defined('JWT_SECRET_KEY')) {
        // Fallback or error handling if key is not defined in wp-config.php
        // For security, it's best to stop if the key isn't set.
        return;
    }
    $secret_key = JWT_SECRET_KEY;

    // Create the token payload
    $payload = [
        'iss' => get_site_url(), // Issuer
        'iat' => time(), // Issued at
        'exp' => time() + (60 * 60), // Expiration time (1 hour)
        'user' => [
            'id' => (string) $user_id,
            'name' => $user_data->display_name,
            'email' => $user_data->user_email,
            'isAdmin' => $is_admin,
        ],
        'paidExamIds' => $paid_exam_ids,
    ];

    // Encode the token
    $jwt = JWT::encode($payload, $secret_key, 'HS256');

    // Build the redirect URL with the token
    $redirect_url = add_query_arg('token', $jwt, $app_auth_url);

    // Redirect the user
    wp_redirect($redirect_url);
    exit;
}

// Hook into the WordPress login action
add_action('wp_login', 'sso_redirect_after_login', 10, 2);


// Custom Login Page to handle the redirect
// This function replaces the content of a page with the slug 'exam-login'
function custom_login_page_redirect() {
    // Check if on the specific login page and user is not logged in
    if (is_page('exam-login') && !is_user_logged_in() && function_exists('wp_login_form')) {
        // Show the standard WordPress login form
        // We're wrapping the output in a basic page structure.
        get_header();
        echo '<div id="primary" class="content-area"><main id="main" class="site-main" role="main"><article class="page type-page status-publish hentry"><div class="entry-content">';
        wp_login_form(array('redirect' => site_url($_SERVER['REQUEST_URI'])));
        echo '</div></article></main></div>';
        get_footer();
        exit;
    }
    // If the user is logged in on this page, the wp_login hook will handle the redirect.
}

add_action('template_redirect', 'custom_login_page_redirect');
?>
`;

const Integration = () => {
    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">WordPress Integration Guide</h1>
            <p className="text-slate-600 mb-6">
                To enable Single Sign-On (SSO) from your WordPress site to this examination app, you need to add some custom PHP code to your WordPress theme's <code>functions.php</code> file. This code will handle user authentication and pass necessary data securely.
            </p>

            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">Step 1: Install JWT Library</h2>
                    <p className="text-slate-600 mb-2">
                        This integration requires the <code>firebase/php-jwt</code> library. If you use Composer for your WordPress project, you can install it by running the following command in your terminal:
                    </p>
                    <pre className="bg-slate-800 text-white p-4 rounded-lg overflow-x-auto">
                        <code>composer require firebase/php-jwt</code>
                    </pre>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">Step 2: Define a Secret Key</h2>
                    <p className="text-slate-600 mb-2">
                        For security, you must define a unique and secret key for signing the JWT. Add the following line to your <code>wp-config.php</code> file.
                    </p>
                    <pre className="bg-slate-800 text-white p-4 rounded-lg overflow-x-auto">
                        <code>define('JWT_SECRET_KEY', 'your-super-secret-key-that-is-long-and-random');</code>
                    </pre>
                    <p className="text-slate-500 mt-2 text-sm">
                        Replace <code>'your-super-secret-key-...'</code> with a long, random string. You can use an online generator to create a strong key.
                    </p>
                </div>
                
                <div>
                    <h2 className="text-2xl font-semibold text-slate-700 mb-2">Step 3: Add to <code>functions.php</code></h2>
                    <p className="text-slate-600 mb-2">
                        Copy and paste the following code into your active WordPress theme's <code>functions.php</code> file. This code handles the login redirection and JWT generation. It also assumes you have a WordPress page with the slug <code>exam-login</code>.
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
