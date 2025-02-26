<?php
$event_venue_id = (int) get_post_meta( $block->context['postId'], '_EventVenueID', true );
$venue_address  = get_post_meta( $event_venue_id, '_VenueAddress', true );
$venue_city     = get_post_meta( $event_venue_id, '_VenueCity', true );
$venue_country  = get_post_meta( $event_venue_id, '_VenueCountry', true );
$venue_region   = get_post_meta( $event_venue_id, '_VenueStateProvince', true );
$venue_zip      = get_post_meta( $event_venue_id, '_VenueZip', true );
?>

<address <?php echo get_block_wrapper_attributes(); ?>>
	<?php if ( ! empty( $venue_address ) ) : ?>
		<?php echo esc_html( $venue_address ); ?>
		<br />
	<?php endif; ?>

	<?php if ( ! empty( $venue_city ) ) : ?>
		<?php echo esc_html( $venue_city ); ?>,
	<?php endif; ?>

	<?php if ( ! empty( $venue_region ) ) : ?>
		<?php echo esc_html( $venue_region ); ?>
	<?php endif; ?>

	<?php if ( ! empty( $venue_zip ) ) : ?>
		<?php echo esc_html( $venue_zip ); ?>
	<?php endif; ?>

	<?php if ( ! empty( $venue_country ) ) : ?>
		<br/>
		<?php echo esc_html( $venue_country ); ?>
	<?php endif; ?>
</address>
