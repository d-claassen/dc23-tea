<?php
$event_organizer_id = (int) get_post_meta( $block->context['postId'], '_EventOrganizerID', true );
$organizer_url       = get_post_meta( $event_organizer_id, '_OrganizerWebsite', true );
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<a href="<?php echo esc_url( $organizer_url ); ?>" class="wp-block-dc23-tea-organizer__url">
		<?php echo esc_html( $organizer_url ); ?>
	</a>
</div>
