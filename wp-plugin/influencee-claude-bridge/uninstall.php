<?php
// Disinstallazione: via chiave, impostazioni e registro. La regola in .htaccess resta (serve anche a WordPress).
defined( 'WP_UNINSTALL_PLUGIN' ) || exit;
foreach ( array( 'icb_key_hash', 'icb_key_user', 'icb_key_creata', 'icb_settings', 'icb_log' ) as $o ) {
	delete_option( $o );
}
