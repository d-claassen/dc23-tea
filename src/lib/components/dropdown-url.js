import {
	Button,
	Dropdown,
	TextControl,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { URLPopover } from '@wordpress/block-editor';

/**
 * Tertiary button which triggers a dropdown
 * with a date (time) picker.
 *
 * @param {Object}   props
 * @param {String}   props.value
 * @param {Function} props.onChange
 * @param {string}   props.buttonLabel
 *
 * @return {Element} Tertiary button with dropdoen date picker.
 */
export function DropdownUrl( {
	url,
	onChange,
	buttonLabel,
	inputLabel = '',
} ) {
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
			renderContent={ ( { onClose } ) => (
				<TextControl
					label={ inputLabel }
					value={ url }
					onChange={ onChange }
				/>
			) }
		/>
	);
}
