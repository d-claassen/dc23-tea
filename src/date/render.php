<?php
$eventAllDay = (bool) get_post_meta( $block->context['postId'], '_EventAllDay', true );
$startDate = new DateTimeImmutable( get_post_meta( $block->context['postId'], '_EventStartDate', true ) );
$endDate = new DateTimeImmutable( get_post_meta( $block->context['postId'], '_EventEndDate', true ) );
$dateTimeSeparator = get_post_meta( $block->context['postId'], '_EventDateTimeSeparator', true );
$timeRangeSeparator = get_post_meta( $block->context['postId'], '_EventTimeRangeSeparator', true );

$now = new DateTimeImmutable();

$hideYearFromStartDate = $now->format('Y')===$startDate->format('Y');
$hideYearFromEndDate = $now->format('Y')===$endDate->format('Y');
$startDateFormatted = date_i18n( ($hideYearFromStartDate ? 'F j' : 'F j, Y'), $startDate->getTimestamp() );
$startTimeFormatted = date_i18n( 'H:i', $startDate->getTimestamp() );
$endDateFormatted = date_i18n( ( $hideYearFromEndDate ? 'F j' : 'F j, Y' ), $endDate->getTimestamp() );
$endTimeFormatted = date_i18n( 'H:i', $endDate->getTimestamp() );

$isOneMoment = $startDate->getTimestamp() === $endDate->getTimestamp();
$isOneDayEvent = $startDate->format('Y-m-d') === $endDate->format('Y-m-d');

?>
<div <?php echo get_block_wrapper_attributes(); ?>>
	<span class="wp-block-dc23-tea-date__date"><?php echo esc_html( $startDateFormatted ) ?></span>

	<?php if ( ! $eventAllDay ) : ?>
		<span class="wp-block-dc23-tea-date__date-time-separator"><?php echo esc_html( $dateTimeSeparator ) ?></span>
		<span class="wp-block-dc23-tea-date__time"><?php echo esc_html( $startTimeFormatted ) ?></span>
	<?php elseif ( $isOneDayEvent ) : ?>
		<span class="wp-block-dc23-tea-date__all-day">all day</span>
	<?php endif; ?>

	<?php if ( ! $isOneMoment ) : ?>
		<?php if ( ! $eventAllDay || ! $isOneDayEvent ) : ?>
			<span class="wp-block-dc23-tea-date__range-separator"><?php echo esc_html( $timeRangeSeparator ) ?></span>
		<?php endif; ?>

		<?php if ( ! $isOneDayEvent ) : ?>
			<span class="wp-block-dc23-tea-date__date"><?php echo esc_html( $endDateFormatted ) ?></span>

			<?php if ( ! $eventAllDay ) : ?>
				<span class="wp-block-dc23-tea-date__date-time-separator"><?php echo esc_html( $dateTimeSeparator ) ?></span>
				<span class="wp-block-dc23-tea-date__time"><?php echo esc_html( $endTimeFormatted ) ?></span>
			<?php endif; ?>
		<?php elseif ( ! $eventAllDay ) : ?>
			<span class="wp-block-dc23-tea-date__time"><?php echo esc_html( $endTimeFormatted ) ?></span>
		<?php endif; ?>
	<?php endif; ?>
</div>
