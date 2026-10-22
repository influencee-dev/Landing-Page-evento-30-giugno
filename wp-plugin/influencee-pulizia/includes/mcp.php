<?php
/**
 * Azioni MCP (WordPress Abilities API + MCP Adapter, se presenti nel sito): Claude può fare il controllo
 * e, con conferma esplicita, le stesse pulizie della pagina. Solo amministratori. Niente comandi né file arbitrari.
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'wp_abilities_api_categories_init',
	function () {
		if ( function_exists( 'wp_register_ability_category' ) ) {
			wp_register_ability_category( 'influencee-pulizia', array( 'label' => 'Influencee Pulizia', 'description' => 'Controllo e pulizia del sito WordPress.' ) );
		}
	}
);

add_action(
	'wp_abilities_api_init',
	function () {
		if ( ! function_exists( 'wp_register_ability' ) ) {
			return;
		}
		$admin = function () {
			return current_user_can( 'manage_options' );
		};
		wp_register_ability(
			'influencee-pulizia/controllo',
			array(
				'label'               => 'Controllo del sito',
				'description'         => 'Server, peso del database e delle opzioni caricate a ogni pagina, cosa c’è da pulire (con i numeri), plugin spenti o da togliere, eventi pianificati senza plugin, accorgimenti di velocità accesi.',
				'category'            => 'influencee-pulizia',
				'input_schema'        => array( 'type' => 'object', 'properties' => new stdClass(), 'additionalProperties' => false ),
				'execute_callback'    => function () {
					return infz_controllo();
				},
				'permission_callback' => $admin,
				'meta'                => array( 'annotations' => array( 'readonly' => true, 'destructive' => false, 'idempotent' => true ), 'mcp' => array( 'public' => true ) ),
			)
		);
		wp_register_ability(
			'influencee-pulizia/pulisci',
			array(
				'label'               => 'Pulisci il sito',
				'description'         => 'Esegue le pulizie scelte (le stesse della pagina Strumenti → Pulizia e velocità), al massimo 500 elementi per voce a giro. Richiede conferma: true. Non tocca contenuti pubblicati, utenti o lead.',
				'category'            => 'influencee-pulizia',
				'input_schema'        => array(
					'type'                 => 'object',
					'properties'           => array(
						'voci'     => array( 'type' => 'array', 'minItems' => 1, 'items' => array( 'type' => 'string', 'enum' => array_keys( infz_voci() ) ) ),
						'conferma' => array( 'type' => 'boolean', 'description' => 'Deve essere true: la pulizia non si può annullare.' ),
					),
					'required'             => array( 'voci', 'conferma' ),
					'additionalProperties' => false,
				),
				'execute_callback'    => function ( $in ) {
					if ( empty( $in['conferma'] ) ) {
						return new WP_Error( 'infz_conferma', 'Serve conferma: true.' );
					}
					return infz_pulisci( $in['voci'], 'mcp' );
				},
				'permission_callback' => $admin,
				'meta'                => array( 'annotations' => array( 'readonly' => false, 'destructive' => true, 'idempotent' => false ), 'mcp' => array( 'public' => true ) ),
			)
		);
	}
);
