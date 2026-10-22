<?php
// Eliminazione del plugin: toglie solo le sue impostazioni e il registro.
defined( 'WP_UNINSTALL_PLUGIN' ) || exit;
delete_option( 'infz_velocita' );
delete_option( 'infz_log' );
