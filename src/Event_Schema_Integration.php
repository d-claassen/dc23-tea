<?php declare(strict_types=1);

namespace DC23\TheEventAttendee;

use Yoast\WP\SEO\Context\Meta_Tags_Context;

class Event_Schema_Integration {
    public function register(): void {
    	// add_filter( 'wpseo_schema_event', [ $this, 'enhance_event_organizer' ], 11, 2 );
    }
}
