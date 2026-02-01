<?php declare(strict_types=1);

namespace DC23\TheEventAttendee;

use Yoast\WP\SEO\Context\Meta_Tags_Context;

class Location_Schema_Integration {
    public function register(): void {
    	add_filter( 'wpseo_schema_event', [ $this, 'enhance_event_location' ], 11, 2 );
    }

    /**
     * Enhance schema.org data describing an Event location.
     *
     * @template T
     *
     * @param T $event_data
     * @param Meta_Tags_Context $context
     *
     * @return T|array{location:object{@id: string}}
     */
    function enhance_event_location( $event_data, $context ) {
    	assert( $context instanceof Meta_Tags_Context );

    	if ( ! ( is_single() && get_post_type() === 'tribe_events' ) ) {
    		return $event_data;
    	}

    	$event_id = get_the_ID();

        if ( tribe_has_venue( $event_id ) && isset( $event_data['location'] ) ) {
            $venue_id   = tribe_get_venue_id( $event_id );
            $venue_slug = get_post_field( 'post_name', $venue_id );

            $event_data['location']->{'@id'} = $context->site_url . '#/schema/Location/' . $venue_slug;
		}

    	return $event_data;
    }
}
