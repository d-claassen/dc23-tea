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
};