<?php declare(strict_types=1);

namespace DC23\TheEventAttendee;

use Yoast\WP\SEO\Context\Meta_Tags_Context;
use function YoastSEO;

class Event_Schema_Integration {
    public function register(): void {
    	add_filter( 'wpseo_schema_event', [ $this, 'enhance_event_with_role' ], 11, 2 );
    }

    /**
     * Enhance schema.org data describing an Event with the role of the entity represented by the website.
     *
     * @template T
     *
     * @param T $event_data
     * @param Meta_Tags_Context $context
     *
     * @return T|array{attendee:array, organizer:array, sponsor:array, performer:array}
     */
    function enhance_event_with_role( $event_data, $context ) {
    	assert( $context instanceof Meta_Tags_Context );
    
    	if ( ! ( is_single() && get_post_type() === 'tribe_events' ) ) {
    		return $event_data;
    	}
    
    	$event_id = get_the_ID();
    
    	$roles = get_post_meta( $event_id, '_EventRole', true );
    	if ( empty( $roles ) ) {
    		return $event_data;
    	}
    
    	if ( $context->site_represents !== 'person' ) {
    		return $event_data;
    	}
    
    	$person_reference = [
    		'@id'  => YoastSEO()->helpers->schema->id->get_user_schema_id( $context->site_user_id, $context ),
    	];
    
    	if ( in_array( 'Attending', $roles, true ) && empty( $event_data['attendee'] ) ) {
    		$event_data['attendee'] = $person_reference;
    	}
    	if ( in_array( 'Organizing', $roles, true ) && empty( $event_data['organizer'] ) ) {
    		$event_data['organizer'] = $person_reference;
    	}
    	if ( in_array( 'Sponsoring', $roles, true ) && empty( $event_data['sponsor'] ) ) {
    		$event_data['sponsor'] = $person_reference;
    	}
    	if ( in_array( 'Performing', $roles, true ) && empty( $event_data['performer'] ) ) {
    		$event_data['performer'] = $person_reference;
    	}
    
    	return $event_data;
    }
}
