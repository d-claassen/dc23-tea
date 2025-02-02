import {
	Button,
	DateTimePicker,
	DatePicker,
	Dropdown,
} from '@wordpress/components';

/**
 * Tertiary button which triggers a dropdown
 * with a date (time) picker.
 *
 * @param {Object} props
 * @param {Date} props.date
 * @param {Function} props.setDate
 * @param {string} props.buttonLabel
 * @param {boolean} props.hasTimePicker
 *
 * @return {Element}
 */
export function DropdownDateTimePicker( {
	date,
	setDate,
	buttonLabel = 'Select date',
	hasTimePicker = true,
} ) {
	const PickerComponent = hasTimePicker ? DateTimePicker : DatePicker;

	return (
		<Dropdown
			popoverProps={ {
				position: 'bottom left left',
			} }
			renderToggle={ ( { isOpen, onToggle } ) => (
				<Button
					variant="tertiary"
					onClick={ onToggle }
					aria-expanded={ isOpen }
				>
					{ buttonLabel }
				</Button>
			) }
			renderContent={ ( { onClose } ) => (
				<PickerComponent
					currentDate={ date }
					onChange={ ( newDate ) => {
						setDate( newDate );
						onClose();
					} }
				/>
			) }
		/>
	);
}
