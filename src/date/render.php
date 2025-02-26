<?php
$event_all_day        = (bool) get_post_meta( $block->context['postId'], '_EventAllDay', true );
$start_date           = new DateTimeImmutable( get_post_meta( $block->context['postId'], '_EventStartDate', true ) );
$end_date             = new DateTimeImmutable( get_post_meta( $block->context['postId'], '_EventEndDate', true ) );
$date_time_separator  = get_post_meta( $block->context['postId'], '_EventDateTimeSeparator', true );
$time_range_separator = get_post_meta( $block->context['postId'], '_EventTimeRangeSeparator', true );

$now = new DateTimeImmutable();

$hide_year_from_start_date = $now->format( 'Y' ) === $start_date->format( 'Y' );
$hide_year_from_end_date   = $now->format( 'Y' ) === $end_date->format( 'Y' );
$start_date_formatted      = date_i18n( ( $hide_year_from_start_date ? 'F j' : 'F j, Y' ), $start_date->getTimestamp() );
$start_time_formatted      = date_i18n( 'H:i', $start_date->getTimestamp() );
$end_date_formatted        = date_i18n( ( $hide_year_from_end_date ? 'F j' : 'F j, Y' ), $end_date->getTimestamp() );
$end_time_formatted        = date_i18n( 'H:i', $end_date->getTimestamp() );

$is_one_moment    = $start_date->getTimestamp() === $end_date->getTimestamp();
$is_one_day_event = $start_date->format( 'Y-m-d' ) === $end_date->format( 'Y-m-d' );

?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<span class="wp-block-dc23-tea-date__date"><?php echo esc_html( $start_date_formatted ); ?></span>

	<?php if ( ! $event_all_day ) : ?>
		<span class="wp-block-dc23-tea-date__date-time-separator"><?php echo esc_html( $date_time_separator ); ?></span>
		<span class="wp-block-dc23-tea-date__time"><?php echo esc_html( $start_time_formatted ); ?></span>
	<?php elseif ( $is_one_day_event ) : ?>
		<span class="wp-block-dc23-tea-date__all-day">all day</span>
	<?php endif; ?>

	<?php if ( ! $is_one_moment ) : ?>
		<?php if ( ! $event_all_day || ! $is_one_day_event ) : ?>
			<span class="wp-block-dc23-tea-date__range-separator"><?php echo esc_html( $time_range_separator ); ?></span>
		<?php endif; ?>

		<?php if ( ! $is_one_day_event ) : ?>
			<span class="wp-block-dc23-tea-date__date"><?php echo esc_html( $end_date_formatted ); ?></span>

			<?php if ( ! $event_all_day ) : ?>
				<span class="wp-block-dc23-tea-date__date-time-separator"><?php echo esc_html( $date_time_separator ); ?></span>
				<span class="wp-block-dc23-tea-date__time"><?php echo esc_html( $end_time_formatted ); ?></span>
			<?php endif; ?>
		<?php elseif ( ! $event_all_day ) : ?>
			<span class="wp-block-dc23-tea-date__time"><?php echo esc_html( $end_time_formatted ); ?></span>
		<?php endif; ?>
	<?php endif; ?>
</div>
