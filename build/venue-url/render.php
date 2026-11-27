<?php
$event_venue_id = (int) get_post_meta( $block->context['postId'], '_EventVenueID', true );
$venue_url      = get_post_meta( $event_venue_id, '_VenueURL', true );
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<a href="<?php echo esc_url( $venue_url ); ?>" class="wp-block-dc23-tea-venue__url">
		<?php echo esc_html( $venue_url ); ?>
	</a>
</div>
