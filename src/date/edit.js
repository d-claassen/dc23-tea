/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { Button, DateTimePicker, Dropdown } from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';

/**
 * Internal dependencies.
 */
import './editor.scss';

const DropdownDateTimePicker = ( {
	date,
	setDate,
	buttonLabel = 'Select date',
} ) => {
	return (
		<Dropdown
			renderToggle={ ( { isOpen, onToggle } ) => (
				<Button variant="link" onClick={ onToggle } aria-expanded={ isOpen }>
					{ buttonLabel }
				</Button>
			) }
			renderContent={ ( { onClose } ) => (
				<DateTimePicker
					currentDate={ date }
					onChange={ ( newDate ) => {
						setDate( newDate );
						onClose();
					} }
				/>
			) }
		/>
	);
};

/**
 * The edit function describes the structure of your block in the context of the
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

	return (
		<div { ...useBlockProps() }>
			<div>
				<DropdownDateTimePicker
					date={ _EventStartDate }
					setDate={ ( newDate ) =>
						updateMeta( { ...meta, _EventStartDate: newDate } )
					}
					buttonLabel={ _EventStartDate }
				/>
				<DropdownDateTimePicker
					date={ _EventEndDate }
					setDate={ ( newDate ) =>
						updateMeta( { ...meta, _EventEndDate: newDate } )
					}
					buttonLabel={ _EventEndDate }
				/>
			</div>
		</div>
	);
}

function Placeholder() {
	return (
		<div { ...useBlockProps() }>
			<span>Time & date</span>
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
