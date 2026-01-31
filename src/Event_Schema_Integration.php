<?php declare(strict_types=1);

namespace DC23\TheEventAttendee;

class Event_Schema_Integration {
    public function register(): void {
        
    }

    /**
     * Enhance schema.org data describing an Event organizer.
     *
     * @template T
     *
     * @param T $event_data
     * @param Meta_Tags_Context $context
     *
     * @return T|array{organizer:array{@id: string}}
     */
    function enhance_event_with_role( $event_data, $context ) {
    	assert( $context instanceof Meta_Tags_Context );
    
    	if ( ! ( is_single() && get_post_type() === 'tribe_events' ) ) {
    		return $event_data;
    	}
    
    	$event_id = get_the_ID();
    

    	return $event_data;
    }
}