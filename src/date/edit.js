/**
 * WordPress dependencies.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useEntityProp } from '@wordpress/core-data';
import { dateI18n, getDate } from '@wordpress/date';

/**
 * Internal dependencies.
 */
import './editor.scss';

function formatDate( date ) {
	const now = new Date();

	// When the date is this year, don't show the year.
	const hideYearFromDate = now.getFullYear() === date.getFullYear();

	return {
		date: hideYearFromDate ? dateI18n( 'F j', date ) : dateI18n( 'F j, Y', date ),
		time: dateI18n( 'H:i', date ),
	}
}



function isSameMoment( startDate, endDate ) {
	return startDate.toISOString() === endDate.toISOString();
}

function isSameDay( startDate, endDate ) {
	return startDate.toDateString() === endDate.toDateString();
}

/**
 * The edit function describes the structure of your block in the context of
 * the
 * editor. This represents what the editor will render when the block is used.
 *
 * @param  root0
 * @param  root0.context
 * @param  root0.context.postType
 * @param  root0.context.postId
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
function Content( { context: { postType, postId } } ) {
	const [ meta, updateMeta ] = useEntityProp(
		'postType',
		postType,
		'meta',
		postId
	);

	const {
		_EventAllDay, // boolean
		_EventStartDate, // string, YYYY-MM-DD HH:mm:ss, local tz
		_EventStartDateUTC, // string, YYYY-MM-DD HH:mm:ss, UTC
		_EventEndDate, // string, YYYY-MM-DD HH:mm:ss, local tz
		_EventEndDateUTC, // string, YYYY-MM-DD HH:mm:ss, UTC
		_EventDateTimeSeparator, // string
		_EventTimeRangeSeparator, // string
	} = meta;

	const startDate = getDate( _EventStartDate );
	const startLabels = formatDate( startDate );

	const endDate = getDate( _EventEndDate );
	const endLabels = formatDate( endDate );

	const isOneMoment = isSameMoment( startDate, endDate );
	const isOneDayEvent = isSameDay( startDate, endDate );

	return (
		<div { ...useBlockProps() }>
			<span className="wp-block-dc23-tea-date__date"> { startLabels.date } </span>

			{ /* ! all day? */ }
			{ ! _EventAllDay ? (
				<>
					<span className="wp-block-dc23-tea-date__date-time-separator"> { _EventDateTimeSeparator } </span>
					<span className="wp-block-dc23-tea-date__time"> { startLabels.time } </span>
				</>
			) : (
				isOneDayEvent && <span className="wp-block-dc23-tea-date__all-day"> all day </span>
			) }


			{ /* if start date time <> end date time */ }
			{ ! isOneMoment && (
				<>
					{ /* Separator between Start Date(time) + End Date/Time/Datetime */ }
					{ ( ! _EventAllDay || ! isOneDayEvent ) && (
						<span className="wp-block-dc23-tea-date__range-separator"> { _EventTimeRangeSeparator } </span>
					) }

					{/*// if end date <> start date*/}
					{ ! isOneDayEvent ? (
						<>
							<span className="wp-block-dc23-tea-date__date"> { endLabels.date } </span>

							{ ! _EventAllDay && (
								<>
									<span className="wp-block-dc23-tea-date__date-time-separator"> { _EventDateTimeSeparator } </span>
									<span className="wp-block-dc23-tea-date__time"> { endLabels.time }</span>
								</>
							)}
						</>
					) : (
						! _EventAllDay && (<span className="wp-block-dc23-tea-date__time"> {endLabels.time}</span>)
					)	}

					{/*// if timezone*/}
						{/*// timezone*/}
				</>
			) }
		</div>
	);
}

function Placeholder() {
	return (
		<div { ...useBlockProps() }>
			<span>Date & time</span>
		</div>
	);
}

export default function Edit( { context } ) {
	const { postType, postId } = context;

	return (
		<>
			{ postId && postType ? (
				<Content context={ context } />
			) : (
				<Placeholder />
			) }
		</>
	);
}
