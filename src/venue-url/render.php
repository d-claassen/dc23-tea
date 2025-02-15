?php
$eventVenueId = (int) get_post_meta( $block->context['postId'], '_EventVenueID', true );
$venueUrl = get_post_meta( $eventVenueId, '_VenueURL', true );
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
    	<a href="<?php echo esc_url( $venueUrl ) ?>" class="wp-block-dc23-tea-venue__url">
        
		<?php echo esc_html( $venueUrl ) ?>
	</a>
</div>
