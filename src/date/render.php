<?php
$startDate = get_post_meta( $block->context['postId'], '_EventStartDate', true );
$endDate = get_post_meta( $block->context['postId'], '_EventEndDate', true );


?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<span><?php echo esc_html( $startDate ) ?></span>
	<span><?php echo esc_html( $endDate ) ?></span>
	<span>All day</span>
</div>
