<?php
$eventVenueId = (int) get_post_meta( $block->context['postId'], '_EventVenueID', true );
$venueAddress = get_post_meta( $eventVenueId, '_VenueAddress', true );
$venueCity = get_post_meta( $eventVenueId, '_VenueCity', true );
$venueCountry = get_post_meta( $eventVenueId, '_VenueCountry', true );
?>
<address <?php echo get_block_wrapper_attributes(); ?>>
    <?php if ( ! empty( $venueAddress ) ): ?>
	<?php echo esc_html( $venueAddress ) ?><br/>
    <?php endif; ?>
    
    <?php if ( ! empty( $venueCity ) ): ?>
	<?php echo esc_html( $venueCity ) ?>,
    <?php endif; ?>
    
    <?php if ( ! empty( $venueCountry ) ): ?>
	<?php echo esc_html( $venueCountry ) ?><br/>
    <?php endif; ?>

    
</address>