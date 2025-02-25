<?php
$eventVenueId = (int) get_post_meta( $block->context['postId'], '_EventVenueID', true );
$eventVenue   = get_post( $eventVenueId );
$venueName    = ( $eventVenue instanceof WP_Post ) ? $eventVenue->post_title : '';
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<?php echo esc_html( $venueName ); ?>
</div>
