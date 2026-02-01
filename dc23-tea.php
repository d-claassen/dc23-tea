<?php
/**
 * Plugin Name:       The Event Attendee
 * Description:       A plugin to help list the events you attend(ed).
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Requires Plugins:  wordpress-seo, the-events-calendar
 * Version:           0.8.2
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       dc23-tea
 * GitHub Plugin URI: https://github.com/d-claassen/dc23-tea
 * Primary Branch:    main
 * Release Asset:     true
 *
 * @package Dc23
 */

declare( strict_types=1 );

use Yoast\WP\SEO\Context\Meta_Tags_Context;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

require_once 'vendor/autoload.php';
require_once 'lib/Event_Schema_Integration.php';
require_once 'lib/Organizer_Schema_Integration.php';

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
	register_block_type( __DIR__ . '/build/venue-address' );
	register_block_type( __DIR__ . '/build/venue-name' );
	register_block_type( __DIR__ . '/build/venue-url' );

	( new \DC23\TheEventAttendee\Event_Schema_Integration() )->register();
	( new \DC23\TheEventAttendee\Organizer_Schema_Integration() )->register();
}
add_action( 'init', 'dc23_tea_block_init' );


/**
 * Load the admin script.
 */
function load_custom_wp_admin_scripts() {

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
		[],
		$asset_file['version']
	);
	wp_enqueue_style( 'dc23-tea-extended' );
}

add_action( 'enqueue_block_editor_assets', 'load_custom_wp_admin_scripts' );

/**
 * Custom auth_callback for register_meta extending tribe_events.
 *
 * @param bool $allowed
 * @param string $meta_key
 * @param int $post_id
 *
 * @return bool
 */
function register_custom_event_meta_auth_callback( $allowed, $meta_key, $post_id ) {
	$post          = get_post( $post_id );
	$post_type_obj = get_post_type_object( $post->post_type );

	return current_user_can( $post_type_obj->cap->edit_post, $post_id );
}

function register_custom_event_meta() {
	register_meta(
		'post',
		'_EventRole',
		[
			'object_subtype' => 'tribe_events',
			'type'           => 'array',
			'single'         => true,
			'auth_callback'  => 'register_custom_event_meta_auth_callback',
			'label'          => 'Role at event',
			'show_in_rest'   => [
				'schema' => [
					'type'  => 'array',
					'items' => [],
				],
			],
		],
	);
}

add_action( 'rest_api_init', 'register_custom_event_meta' );

function custom_glance_items( $items = array() ) {
    // type check
    if ( ! is_array( $items ) ) {
        return $items;
    }

    // just event, but could add other TEC types
    $post_types = array(
					array(
						'tribe_events',
						fn ( int $posts ) => _n( '%s Event', '%s Events', $posts, 'dc23-tea' ),
					)
				);

    foreach( $post_types as list( $type, $label ) ) {
        if( ! post_type_exists( $type ) ) continue;

        $num_posts = wp_count_posts( $type );

        if( $num_posts ) {

            $published = intval( $num_posts->publish );
            $post_type = get_post_type_object( $type );

            $text = $label( $published );
            $text = sprintf( $text, number_format_i18n( $published ) );

            if ( current_user_can( $post_type->cap->edit_posts ) ) {
                $items[] = sprintf( '<a class="%1$s-count" href="edit.php?post_type=%1$s">%2$s</a>', $type, $text ) . "\n";
            } else {
                $items[] = sprintf( '<span class="%1$s-count">%2$s</span>', $type, $text ) . "\n";
            }
        }
    }

    return $items;
}

add_filter( 'dashboard_glance_items', 'custom_glance_items', 10, 1 );

function dc23_include_events_in_dashboard_activity( $query_args ) {
	// Make sure we're working with an array
	if ( ! is_array( $query_args ) ) {
		return $query_args;
	}

	// Bail if 'post_type' is missing
	if ( ! isset( $query_args['post_type'] ) ) {
		return $query_args;
	}

	$post_types = $query_args['post_type'];

	// Normalize to array
	if ( is_string( $post_types ) ) {
		$post_types = [ $post_types ];
	}

	// If it's not an array even after normalization, abort
	if ( ! is_array( $post_types ) ) {
		return $query_args;
	}

	// Add 'tribe_events' if not already in the list
	if ( ! in_array( 'tribe_events', $post_types, true ) ) {
		$post_types[] = 'tribe_events';
	}

	$query_args['post_type'] = $post_types;

	return $query_args;
}

add_filter( 'dashboard_recent_posts_query_args', 'dc23_include_events_in_dashboard_activity' );

/**
 * Yoast SEO fix for The Events Archive.
 *
 * Disables the SEO title tweaks made by The Events Calendar plugin.
 */
add_action( 'wp', function() {
	if ( tribe_is_event_query() && ! is_singular() ) {
		$hooks = tribe( 'events.views.v2.hooks' );
		if ( ! ( $hooks instanceof Tribe\Events\Views\V2\Hooks ) ) {
			return;
		}

		remove_filter( 'wp_title', [ $hooks, 'filter_wp_title' ], 10 );
		remove_filter( 'document_title_parts', [ $hooks, 'filter_document_title_parts' ], 10 );
		remove_filter( 'pre_get_document_title', [ $hooks, 'pre_get_document_title' ], 20 );
	}
}, 9 );

add_action( 'parse_query', function( $query ) {
	if ( is_admin() || ! ( $query instanceof WP_Query ) ) {
		return;
	}

	if ( $query->get( 'post_type' ) === 'tribe_events' && $query->is_archive() ) {
		$query->set( 'tribe_suppress_query_filters', true );
	}
}, 10 );
