<?php
$eventOrganizerId = (int) get_post_meta( $block->context['postId'], '_EventOrganizerID', true );
$organizerUrl     = get_post_meta( $eventOrganizerId, '_OrganizerWebsite', true );
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<a href="<?php echo esc_url( $organizerUrl ); ?>" class="wp-block-dc23-tea-organizer__url">
		<?php echo esc_html( $organizerUrl ); ?>
	</a>
</div>
