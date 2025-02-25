<?php
$eventOrganizerId = (int) get_post_meta( $block->context['postId'], '_EventOrganizerID', true );
$eventOrganizer   = get_post( $eventOrganizerId );
$organizerTitle   = ( $eventOrganizer instanceof WP_Post ) ? $eventOrganizer->post_title : '';
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<?php echo esc_html( $organizerTitle ); ?>
</div>
