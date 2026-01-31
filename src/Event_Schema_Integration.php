<?php declare(strict_types=1);

namespace DC23\TheEventAttendee;

use Yoast\WP\SEO\Config\Schema_IDs;
use Yoast\WP\SEO\Context\Meta_Tags_Context;

class Event_Schema_Integration {
    public function register(): void {
    	add_filter( 'wpseo_schema_event', [ $this, 'enhance_event_organizer' ], 11, 2 );
    }

    /**
     * Enhance schema.org data describing an Event organizer.
     *
     * @template T
     *
     * @param T $event_data
     * @param Meta_Tags_Context $context
     *
     * @return T|array{organizer:object{@id: string}}
     */
    function enhance_event_organizer( $event_data, $context ) {
    	assert( $context instanceof Meta_Tags_Context );
    
    	if ( ! ( is_single() && get_post_type() === 'tribe_events' ) ) {
    		return $event_data;
    	}
    
    	$event_id = get_the_ID();
    
        if ( tribe_has_organizer( $event_id ) && isset( $event_data['organizer'] ) ) {
            $organizer_id   = tribe_get_organizer_id( $event_id );
            $organizer_slug = get_post_field( 'post_name', $organizer_id );
            
            $event_data['organizer']->{'@type'} = 'Organization';
            $event_data['organizer']->{'@id'}   = $context->site_url . '/#/schema/Organization/' . $organizer_slug;
		}

    	return $event_data;
    }
}