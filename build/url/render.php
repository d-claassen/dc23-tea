<?php
$event_url = get_post_meta( $block->context['postId'], '_EventURL', true );
?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<a href="<?php echo esc_url( $event_url ); ?>" class="wp-block-dc23-tea-url__url">
		<?php echo esc_html( $event_url ); ?>
	</a>
</div>
