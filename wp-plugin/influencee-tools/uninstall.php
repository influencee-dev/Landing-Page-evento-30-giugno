<?php
// Rimozione del plugin: cancella solo le impostazioni (nessun dato dei lead è salvato qui).
defined( 'WP_UNINSTALL_PLUGIN' ) || exit;
delete_option( 'inft_settings' );
delete_option( 'inft_mcp_log' );
