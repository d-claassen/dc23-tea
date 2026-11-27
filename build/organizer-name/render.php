<?php
$event_organizer_id = (int) get_post_meta( $block->context['postId'], '_EventOrganizerID', true );
$event_organizer    = get_post( $event_organizer_id );
$organizer_title    = ( $event_organizer instanceof WP_Post ) ? $event_organizer->post_title : '';
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<?php echo esc_html( $organizer_title ); ?>
</div>
