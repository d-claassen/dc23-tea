<?php
/**
 * Plugin Name:       The Event Attendee
 * Description:       A plugin to help list the events you attend(ed).
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Requires Plugins:  wordpress-seo, the-events-calendar
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       dc23-tea
 *
 * @package Dc23
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function dc23_tea_block_init() {
	register_block_type( __DIR__ . '/build/date' );
	register_block_type( __DIR__ . '/build/organizer-name' );
	register_block_type( __DIR__ . '/build/organizer-url' );
	register_block_type( __DIR__ . '/build/url' );
	register_block_type( __DIR__ . '/build/venue' );
}
add_action( 'init', 'dc23_tea_block_init' );



/**
 * Load the admin script.
 *
 * @param string $hook The hook name of the page.
 */
function load_custom_wp_admin_scripts( $hook ) {

	// Automatically load imported dependencies and assets version.
	$asset_file = include plugin_dir_path( __FILE__ ) . '/build/index.asset.php';

	// Load the required WordPress packages.
	foreach ( $asset_file['dependencies'] as $style ) {
		wp_enqueue_script( $style );
	}

	// Load our app.js.
	wp_register_script(
		'dc23-tea-extended',
		plugins_url( 'build/index.js', __FILE__ ),
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);
	wp_enqueue_script( 'dc23-tea-extended' );

	// Load our style.css.
	wp_register_style(
		'dc23-tea-extended',
		plugins_url( 'build/style-index.css', __FILE__ ),
		array(),
		$asset_file['version']
	);
	wp_enqueue_style( 'dc23-tea-extended' );
}

add_action( 'enqueue_block_editor_assets', 'load_custom_wp_admin_scripts' );
