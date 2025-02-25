<?php
$event_venue_i  = (int) get_post_meta( $block->context['postId'], '_EventVenueID', true );
$event_venue   = get_post( $event_venue_id );
$venue_name    = ( $event_venue instanceof WP_Post ) ? $eventVenue->post_title : '';
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<?php echo esc_html( $venue_name ); ?>
</div>
