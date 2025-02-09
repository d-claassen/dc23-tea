import { Button, Dropdown, TextControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * Tertiary button which triggers a dropdown
 * with a date (time) picker.
 *
 * @param {Object}   props
 * @param {string}   props.url
 * @param {Function} props.onChange
 * @param {string}   props.buttonLabel
 * @param {string}   props.inputLabel
 *
 * @return {Element} Tertiary button with dropdoen date picker.
 */
export function DropdownUrl( {
	url: originalUrl,
	onChange,
	buttonLabel,
	inputLabel = '',
} ) {
	const [ url, setUrl ] = useState( originalUrl );

	return (
		<Dropdown
			contentClassName={ 'dc23-tea-dropdown-url' }
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
			renderContent={ () => (
				<TextControl
					label={ inputLabel }
					value={ url }
					onChange={ setUrl }
				/>
			) }
			onClose={ () => {
				onChange( url );
			} }
		/>
	);
}
