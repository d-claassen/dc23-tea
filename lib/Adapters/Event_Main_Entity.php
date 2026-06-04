<?php
/**
 * TEC main entity.
 *
 * @package DC23\Tea
 */

declare( strict_types=1 );

namespace DC23\TheEventAttendee\Adapters;

use DC23\ExcessiveSchema\Adapters\Main_Entity;
use Tribe__Events__JSON_LD__Event;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Main entity for TEC's Event schema piece.
 *
 * TEC ships its own Yoast schema piece (Events_Schema) that hooks Yoast's
 * graph and emits an Event node. This adapter bridges Yoast's
 * `wpseo_schema_event` filter into `dc23_schema_main_entity` so enrichment
 * logic in dc23-excessive-schema can attach to TEC events the same way it
 * attaches to Articles.
 *
 * Type identity and `@id` format mirror TEC's own logic by reading from
 * Tribe__Events__JSON_LD__Event::instance(), so we stay consistent with
 * what TEC actually emits.
 */
final class Event_Main_Entity implements Main_Entity {

	public function get_root_type(): string {
		if ( ! class_exists( Tribe__Events__JSON_LD__Event::class ) ) {
			return 'Event';
		}
		return Tribe__Events__JSON_LD__Event::instance()->type;
	}

	/**
	 * TEC sets the event type globally on the JSON_LD singleton rather than
	 * per-instance. Future TEC versions could change this; revisit if
	 * per-event subtypes are added.
	 */
	public function get_entity_type( Indexable $indexable ): ?string {
		return $this->get_root_type();
	}

	/**
	 * Mirrors TEC's @id construction at
	 * src/Events/Integrations/Plugins/WordPress_SEO/Events_Schema.php:194:
	 *
	 *   $d->{'@id'} = $permalink . '#' . strtolower( esc_attr( $d->{'@type'} ) );
	 *
	 * Reading the type from TEC's singleton keeps us aligned even if TEC
	 * changes the default type or someone filters it.
	 */
	public function get_entity_id( Indexable $indexable ): string {
		$permalink = $indexable->permalink;
		if ( \YoastSEO()->helpers->url->is_relative( $permalink ) ) {
			$permalink = home_url( $permalink );
		}

		$type = $this->get_root_type();
		return $permalink . '#' . strtolower( esc_attr( $type ) );
	}

	public function get_allowed_subtypes(): ?array {
		return null;
	}

	public function setup_main_entity_enrichment(): void {
		// Main Entity enrichment adds a `mentions` property to the passed node.
		// But since Event is not a CreativeWork, it has no `mentions` property.
	}
}
