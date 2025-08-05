/**
 * ===================================================================
 * V14: Role-Based URL Redirection for Admins
 * ===================================================================
 * This version redirects administrators to a separate testing URL,
 * while regular users go to the production URL.
 */

// --- CONFIGURATION ---
define('ANNAPOORNA_LOGIN_SLUG', 'exam-login');
define('ANNAPOORNA_PROD_APP_URL', 'https://exams.coding-online.net/'); // Production URL for regular users
define('ANNAPOORNA_ADMIN_APP_URL', 'https://mco-exam-jkfzdt3bj-manoj-balakrishnans-projects-aa177a85.vercel.app/'); // Vercel test URL for admins
define('ANNAPOORNA_JWT_SECRET_KEY', 'K7x$4tZ!Gv2#h1wM9uY^eP*8Aq@R5sV%z3Jb0D&fL6N'); // <-- IMPORTANT: REPLACE THIS with a new, strong, random key!
// --- END CONFIGURATION ---

/**
 * Helper function to get the correct redirect URL based on user role.
 */
function annapoorna_get_redirect_url_for_user($user_id) {
    if (!$user_id) {
        return ANNAPOORNA_PROD_APP_URL; // Default to prod if no user
    }
    $user = get_userdata($user_id);
    if ($user && in_array('administrator', (array) $user->roles)) {
        return ANNAPOORNA_ADMIN_APP_URL;
    }
    return ANNAPOORNA_PROD_APP_URL;
}

// SECTION 1: CORE PAYLOAD & TOKEN GENERATION
function annapoorna_exam_get_payload($user_id) {
    $user = get_userdata($user_id);
    if (!$user) return null;

    $is_admin = in_array('administrator', (array) $user->roles);

    $user_full_name = get_user_meta($user_id, '_exam_portal_full_name', true);
    if (empty($user_full_name)) { $user_full_name = trim($user->first_name . ' ' . $user->last_name); }
    if (empty($user_full_name)) { $user_full_name = $user->display_name; }
    
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
function annapoorna_base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function annapoorna_generate_exam_jwt($user_id) {
    $secret_key = defined('ANNAPOORNA_JWT_SECRET_KEY') ? ANNAPOORNA_JWT_SECRET_KEY : '';
    if (empty($secret_key) || $secret_key === 'your-very-strong-secret-key') { return null; }
    $payload = annapoorna_exam_get_payload($user_id);
    if (!$payload) return null;
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $base64UrlHeader = annapoorna_base64url_encode($header);
    $base64UrlPayload = annapoorna_base64url_encode(json_encode($payload));
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret_key, true);
    $base64UrlSignature = annapoorna_base64url_encode($signature);
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

function annapoorna_redirect_after_purchase($order_id) {
    if (!$order_id) return;
    $order = wc_get_order($order_id);
    if (!$order) return;
    $user_id = $order->get_customer_id();
    if ($user_id > 0 && $order->has_status(array('completed', 'processing'))) {
        $token = annapoorna_generate_exam_jwt($user_id);
        if ($token) {
            $base_url = annapoorna_get_redirect_url_for_user($user_id);
            $redirect_url = $base_url . '#/auth?token=' . $token . '&redirect_to=/dashboard';
            wp_redirect($redirect_url);
            exit;
        }
    }
}
add_action('woocommerce_thankyou', 'annapoorna_redirect_after_purchase', 10, 1);

// SECTION 2: SHORTCODE FOR CUSTOM LOGIN PORTAL
function annapoorna_exam_login_shortcode() {
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
            $base_url = annapoorna_get_redirect_url_for_user($user->ID);
            $final_redirect_url = $base_url . '#/auth?token=' . $token . '&redirect_to=' . urlencode($redirect_to);
            wp_redirect($final_redirect_url);
            exit;
        }
    }
    
    ob_start();
    if (is_user_logged_in()) {
        $user_id = get_current_user_id();
        $token = annapoorna_generate_exam_jwt($user_id);
        $base_url = annapoorna_get_redirect_url_for_user($user_id);
        $proceed_url = $base_url . '#/auth?token=' . $token . '&redirect_to=' . urlencode($redirect_to);
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
function annapoorna_exam_check_redirect_on_load() {
    if (is_user_logged_in()) {
        $user_id = get_current_user_id();
        if (get_transient('annapoorna_redirect_after_register_' . $user_id)) {
            delete_transient('annapoorna_redirect_after_register_' . $user_id);
            $token = annapoorna_generate_exam_jwt($user_id);
            $base_url = annapoorna_get_redirect_url_for_user($user_id);
            $final_redirect_url = $base_url . '#/auth?token=' . $token . '&redirect_to=/dashboard';
            wp_redirect($final_redirect_url);
            exit;
        }
    }
}
add_action('template_redirect', 'annapoorna_exam_check_redirect_on_load');
?>
`;

const apiCode = `
<?php
/**
 * ===================================================================
 * V3: Custom REST API Endpoint for Exam Products (Robust Version)
 * ===================================================================
 * This version improves reliability by ensuring CORS headers are sent
 * and by adding a check for WooCommerce to prevent fatal errors.
 */

// Callback function to fetch and format product data
function annapoorna_get_exam_products_callback() {
    $args = array(
        'post_type' => 'product',
        'posts_per_page' => -1,
        'tax_query' => array(
            array(
                'taxonomy' => 'product_cat',
                'field'    => 'slug',
                'terms'    => 'certification-exams', // The category slug for your exam products
            ),
        ),
    );

    $products = wc_get_products($args);
    $formatted_products = array();

    if (empty($products)) {
        return new WP_REST_Response(array(), 200);
    }

    foreach ($products as $product) {
        $formatted_products[] = array(
            'id'                     => $product->get_id(),
            'name'                   => $product->get_name(),
            'description'            => $product->get_short_description(),
            'purchase_url'           => $product->get_permalink(),
            'price_html'             => $product->get_price_html(),
            'practice_exam_id'       => get_post_meta($product->get_id(), 'practice_exam_id', true),
            'certification_exam_id'  => get_post_meta($product->get_id(), 'certification_exam_id', true),
        );
    }

    return new WP_REST_Response($formatted_products, 200);
}


// Register the custom REST API route and set headers
add_action('rest_api_init', function () {
    // Add a check to ensure WooCommerce is active.
    if (!class_exists('WooCommerce')) {
        return;
    }
    
    // IMPORTANT: This header allows the exam app to fetch data from your WordPress site.
    // It is crucial for fixing the "Network response was not ok" error.
    header('Access-Control-Allow-Origin: *');

    register_rest_route('exam-app/v1', '/products', array(
        'methods' => 'GET',
        'callback' => 'annapoorna_get_exam_products_callback',
        'permission_callback' => '__return_true' // Publicly accessible
    ));
});
?>
`;

export default Integration;
