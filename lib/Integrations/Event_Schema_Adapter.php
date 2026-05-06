<?php
/**
 * Integration that registers the TEC main entity.
 *
 * @package DC23\Tea
 */

declare( strict_types=1 );

namespace DC23\TheEventAttendee\Integrations;

use DC23\TheEventAttendee\Adapters\Event_Main_Entity;
use Tribe__Events__Main;

use function DC23\ExcessiveSchema\dc23_schema_register_main_entity;

/**
 * Registers the TEC main entity with dc23-excessive-schema.
 *
 * Soft dependency on dc23-excessive-schema: hooks the registration action
 * unconditionally, but the action only fires when that plugin is active.
 * If it's not active, the registration is a silent no-op and the rest of
 * dc23-tea continues working.
 */
final class Event_Schema_Adapter {

	public function register(): void {
		add_action( 'dc23_schema_register_main_entities', [ $this, 'register_main_entity' ] );
	}

	public function register_main_entity(): void {
		if ( ! class_exists( Tribe__Events__Main::class ) ) {
			return;
		}

		dc23_schema_register_main_entity(
			Tribe__Events__Main::POSTTYPE,
			new Event_Main_Entity()
		);
	}
}