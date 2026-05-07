<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DiscountCodeController;
use App\Http\Controllers\Admin\FeaturedOfferController;
use App\Http\Controllers\Admin\NewsletterAdminController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ReturnController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Blog\PostController as BlogPostController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Customer\SocialAuthController;
use App\Http\Controllers\Customer\WishlistController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\Shop\ProductController as ShopProductController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\StockAlertController;
use App\Http\Controllers\TrackingController;
use App\Http\Controllers\WebhookController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Cron HTTP (pour Infomaniak planificateur de tâches)
Route::get('/cron/abandoned-carts', function (Request $request) {
    $token = config('services.cron.token');
    if (! $token || $request->query('token') !== $token) {
        abort(403);
    }
    Artisan::call('shop:abandoned-carts');

    return response('OK — '.now(), 200);
})->name('cron.abandoned-carts');

// Sitemap
Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

// Blog public
Route::get('/blog', [BlogPostController::class, 'index'])->name('blog');
Route::get('/blog/{slug}', [BlogPostController::class, 'show'])->name('blog.show');

// Pages publiques
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/boutique', [ShopProductController::class, 'index'])->name('shop');
Route::get('/boutique/{slug}', [ShopProductController::class, 'show'])->name('shop.show');
Route::post('/boutique/{slug}/avis', [ShopProductController::class, 'storeReview'])->name('shop.review.store');
// Panier
Route::get('/panier', [CartController::class, 'index'])->name('cart');
Route::post('/panier/ajouter', [CartController::class, 'add'])->name('cart.add');
Route::patch('/panier/{productId}', [CartController::class, 'update'])->name('cart.update');
Route::delete('/panier/{productId}', [CartController::class, 'remove'])->name('cart.remove');
Route::delete('/panier', [CartController::class, 'clear'])->name('cart.clear');
// Codes promo
Route::post('/panier/promo', [DiscountController::class, 'apply'])->name('discount.apply');
Route::delete('/panier/promo', [DiscountController::class, 'remove'])->name('discount.remove');
// Checkout
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/checkout/success', [CheckoutController::class, 'success'])->name('checkout.success');
Route::get('/checkout/cancel', [CheckoutController::class, 'cancel'])->name('checkout.cancel');

Route::get('/a-propos', fn () => Inertia::render('About'))->name('about');
Route::get('/contact', fn () => Inertia::render('Contact'))->name('contact');
Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');
Route::get('/livraison', fn () => Inertia::render('Livraison'))->name('livraison');
Route::get('/faq', fn () => Inertia::render('Faq'))->name('faq');
Route::get('/mentions-legales', fn () => Inertia::render('MentionsLegales'))->name('mentions-legales');

// Espace client — public
// Suivi de commande public
Route::get('/suivi', [TrackingController::class, 'index'])->name('tracking.index');
Route::post('/suivi', [TrackingController::class, 'track'])->name('tracking.track');

// Alerte retour en stock
Route::post('/stock-alert/subscribe', [StockAlertController::class, 'subscribe'])->name('stock-alert.subscribe');

// Newsletter
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');
Route::get('/newsletter/unsubscribe/{token}', [NewsletterController::class, 'unsubscribeByToken'])->name('newsletter.unsubscribe');

// Social OAuth
Route::get('/auth/{provider}/redirect', [SocialAuthController::class, 'redirect'])->name('social.redirect');
Route::get('/auth/{provider}/callback', [SocialAuthController::class, 'callback'])->name('social.callback');

Route::get('/mon-compte/connexion', [CustomerController::class, 'showLogin'])->name('customer.login');
Route::post('/mon-compte/connexion', [CustomerController::class, 'login'])
    ->middleware('throttle:auth-forms')
    ->name('customer.login.post');
Route::get('/mon-compte/inscription', [CustomerController::class, 'showRegister'])->name('customer.register');
Route::post('/mon-compte/inscription', [CustomerController::class, 'register'])
    ->middleware('throttle:auth-forms')
    ->name('customer.register.post');
Route::post('/mon-compte/deconnexion', [CustomerController::class, 'logout'])->name('customer.logout');
Route::get('/mon-compte/verifier/{token}', [CustomerController::class, 'verify'])->name('customer.verify');
Route::get('/mon-compte/verification-envoyee', [CustomerController::class, 'checkEmail'])->name('customer.check-email');

// Espace client — protégé
Route::middleware('customer')->group(function () {
    Route::get('/mon-compte', [CustomerController::class, 'dashboard'])->name('customer.dashboard');
    Route::get('/mon-compte/commandes', [CustomerController::class, 'orders'])->name('customer.orders');
    Route::get('/mon-compte/profil', [CustomerController::class, 'showProfile'])->name('customer.profile');
    Route::post('/mon-compte/profil', [CustomerController::class, 'updateProfile'])->name('customer.profile.update');
    Route::get('/mon-compte/securite', [CustomerController::class, 'showSecurity'])->name('customer.security');
    Route::post('/mon-compte/mot-de-passe', [CustomerController::class, 'updatePassword'])->name('customer.password.update');

    // Adresses
    Route::get('/mon-compte/adresses', [CustomerController::class, 'showAddresses'])->name('customer.addresses');
    Route::post('/mon-compte/adresses', [CustomerController::class, 'storeAddress'])->name('customer.addresses.store');
    Route::put('/mon-compte/adresses/{address}', [CustomerController::class, 'updateAddress'])->name('customer.addresses.update');
    Route::delete('/mon-compte/adresses/{address}', [CustomerController::class, 'destroyAddress'])->name('customer.addresses.destroy');
    Route::post('/mon-compte/adresses/{address}/default', [CustomerController::class, 'setDefaultAddress'])->name('customer.addresses.default');

    // Avis
    Route::get('/mon-compte/commandes/{order}/facture', [InvoiceController::class, 'customerDownload'])->name('customer.invoice');

    // Wishlist
    Route::get('/mon-compte/favoris', [WishlistController::class, 'index'])->name('customer.wishlist');
    Route::post('/mon-compte/favoris/toggle', [WishlistController::class, 'toggle'])->name('customer.wishlist.toggle');
    Route::get('/mon-compte/avis', [CustomerController::class, 'showReviews'])->name('customer.reviews');
    Route::post('/mon-compte/avis', [CustomerController::class, 'storeReview'])->name('customer.reviews.store');

    // Codes promo
    Route::get('/mon-compte/promos', [CustomerController::class, 'showPromos'])->name('customer.promos');

    // Retours
    Route::post('/mon-compte/commandes/{order}/retour', [CustomerController::class, 'storeReturn'])->name('customer.return.store');
});

// Webhook Stripe (exclut CSRF via bootstrap/app.php)
Route::post('/webhook/stripe', [WebhookController::class, 'handle'])->name('webhook.stripe');

// Auth admin
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:auth-forms')
        ->name('login.post');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::get('/2fa', [AuthController::class, 'showTwoFactor'])->name('2fa');
    Route::post('/2fa/verify', [AuthController::class, 'verifyTwoFactor'])->name('2fa.verify');
    Route::post('/2fa/resend', [AuthController::class, 'resendTwoFactor'])->name('2fa.resend');

    // Routes protégées admin
    Route::middleware(AdminMiddleware::class)->group(function () {
        Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

        // Produits
        Route::get('/produits', [AdminProductController::class, 'index'])->name('products.index');
        Route::get('/produits/create', [AdminProductController::class, 'create'])->name('products.create');
        Route::post('/produits', [AdminProductController::class, 'store'])->name('products.store');
        Route::get('/produits/{product}/edit', [AdminProductController::class, 'edit'])->name('products.edit');
        Route::put('/produits/{product}', [AdminProductController::class, 'update'])->name('products.update');
        Route::delete('/produits/{product}', [AdminProductController::class, 'destroy'])->name('products.destroy');
        Route::delete('/images/{image}', [AdminProductController::class, 'destroyImage'])->name('images.destroy');

        // Commandes
        Route::get('/commandes', [OrderController::class, 'index'])->name('orders.index');
        Route::get('/commandes/export/csv', [OrderController::class, 'export'])->name('orders.export');
        Route::get('/commandes/{order}', [OrderController::class, 'show'])->name('orders.show');
        Route::post('/commandes/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');
        Route::post('/commandes/{order}/tracking', [OrderController::class, 'updateTracking'])->name('orders.tracking');
        Route::post('/commandes/{order}/ship', [OrderController::class, 'ship'])->name('orders.ship');
        Route::post('/commandes/{order}/refund', [OrderController::class, 'refund'])->name('orders.refund');
        Route::post('/commandes/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
        Route::get('/commandes/{order}/facture', [InvoiceController::class, 'adminDownload'])->name('orders.invoice');

        // Paramètres
        Route::get('/parametres', [SettingController::class, 'index'])->name('settings.index');
        Route::post('/parametres', [SettingController::class, 'update'])->name('settings.update');

        // Catégories
        Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
        Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
        Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

        // Codes promo
        Route::get('/codes-promo', [DiscountCodeController::class, 'index'])->name('discount-codes.index');
        Route::post('/codes-promo', [DiscountCodeController::class, 'store'])->name('discount-codes.store');
        Route::put('/codes-promo/{discountCode}', [DiscountCodeController::class, 'update'])->name('discount-codes.update');
        Route::delete('/codes-promo/{discountCode}', [DiscountCodeController::class, 'destroy'])->name('discount-codes.destroy');

        // Offres phares
        Route::get('/offres', [FeaturedOfferController::class, 'index'])->name('featured-offers.index');
        Route::post('/offres', [FeaturedOfferController::class, 'store'])->name('featured-offers.store');
        Route::put('/offres/{featuredOffer}', [FeaturedOfferController::class, 'update'])->name('featured-offers.update');
        Route::delete('/offres/{featuredOffer}', [FeaturedOfferController::class, 'destroy'])->name('featured-offers.destroy');

        // Newsletter
        Route::get('/newsletter', [NewsletterAdminController::class, 'index'])->name('newsletter.index');
        Route::delete('/newsletter/{subscriber}', [NewsletterAdminController::class, 'destroy'])->name('newsletter.destroy');
        Route::get('/newsletter/export', [NewsletterAdminController::class, 'export'])->name('newsletter.export');

        Route::get('/avis', [ReviewController::class, 'index'])->name('reviews.index');
        Route::post('/avis', [ReviewController::class, 'store'])->name('reviews.store');
        Route::put('/avis/{review}', [ReviewController::class, 'update'])->name('reviews.update');
        Route::delete('/avis/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');

        Route::get('/articles', [AdminPostController::class, 'index'])->name('posts.index');
        Route::get('/articles/nouveau', [AdminPostController::class, 'create'])->name('posts.create');
        Route::post('/articles', [AdminPostController::class, 'store'])->name('posts.store');
        Route::get('/articles/{post}/modifier', [AdminPostController::class, 'edit'])->name('posts.edit');
        Route::put('/articles/{post}', [AdminPostController::class, 'update'])->name('posts.update');
        Route::delete('/articles/{post}', [AdminPostController::class, 'destroy'])->name('posts.destroy');

        // Retours clients
        Route::get('/retours', [ReturnController::class, 'index'])->name('returns.index');
        Route::post('/retours/{return}/decision', [ReturnController::class, 'decide'])->name('returns.decide');
    });
});
