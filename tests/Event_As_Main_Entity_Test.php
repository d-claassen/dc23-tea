<?php
/**
 * Integration tests for the Event main entity.
 *
 * @package DC23\TheEventAttendee\Tests
 */

declare( strict_types=1 );

namespace DC23\TheEventAttendee\Tests;

use DC23\TheEventAttendee\Adapters\Event_Main_Entity;
use DC23\ExcessiveSchema\Registries\Main_Entity_Registry;
use WP_UnitTestCase;

use function DC23\ExcessiveSchema\dc23_schema_get_main_entity;
use function DC23\ExcessiveSchema\dc23_schema_main_entity_exists;

final class Event_As_Main_Entity_Test extends WP_UnitTestCase {

	public function set_up(): void {
		parent::set_up();
		
		// Create test user for publisher. was needed for Article ouput from wordpress-seo below 26.7. events too?
		$this->user_id = self::factory()->user->create( [
			'display_name' => 'Test User',
			'user_email'   => 'test@example.com',
			'user_url'     => 'https://example.com',
		] );


		// Set Yoast user settings to use person schema
		\YoastSEO()->helpers->options->set( 'company_or_person', 'person' );
		\YoastSEO()->helpers->options->set( 'company_or_person_user_id', $this->user_id );
	}

	/**
	 * Override WordPress function that's incompatible with PHPUnit 10+.
	 */
	public function expectDeprecated(): void {
	}

	public function test_event_main_entity_registered_for_post_post_type(): void {
		// Verify Event is registered.
		$this->assertTrue(
			dc23_schema_main_entity_exists( 'tribe_events' ),
			'Event main entity should be registered for the "tribe_events" post type.'
		);

		// Verify basics.
		$main_entity = dc23_schema_get_main_entity( 'tribe_events' );
		$this->assertInstanceOf( Event_Main_Entity::class, $main_entity );
		$this->assertSame( 'Event', $main_entity->get_root_type() );
        
		// Create an indexable.
		$post_id   = self::factory()->post->create( [ 'post_status' => 'publish', 'post_type' => 'tribe_events' ] );
		$indexable = \YoastSEO()->meta->for_post( $post_id )->context->indexable;
        
		// Verify id creation.
		$entity_id = $main_entity->get_entity_id( $indexable );
		$this->assertStringEndsWith( '#event', $entity_id );
		$this->assertStringStartsWith( $indexable->permalink, $entity_id );
	}

	// -------------------------------------------------------------------------
	// Helpers
	// -------------------------------------------------------------------------

	private function get_schema( int $post_id, bool $debug = false ): array {
		$this->go_to( get_permalink( $post_id ) );

		ob_start();
		do_action( 'wpseo_head' );
		$output = ob_get_clean();

		preg_match( '/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s', $output, $matches );

		if ( $debug ) {
			var_dump( $matches[0] ?? 'no matches' );
		}

		return json_decode( $matches[1] ?? '{}', true );
	}

	private function get_event_schema( int $post_id, bool $debug = false ): ?array {
		$schema = $this->get_schema( $post_id, $debug );

		foreach ( $schema['@graph'] ?? [] as $piece ) {
			if ( isset( $piece['@type'] ) && $piece['@type'] === 'Event' ) {
				return $piece;
			}
		}

		return null;
	}
}
