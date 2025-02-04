import { Button, Dropdown, SelectControl } from '@wordpress/components';

/**
 * Dropdown element to select a wp_post from any post_type.
 *
 * @return {Element} The dropdown.
 */
export function DropdownPostSelect( {
	buttonLabel,
	inputLabel = '',
	value,
	options,
	onChange,
} ) {
	return (
		<Dropdown
			contentClassName={ 'dc23-tea-dropdown-post-select' }
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
				<SelectControl
					label={ inputLabel }
					value={ value }
					options={ options }
					onChange={ onChange }
				/>
			) }
		/>
	);
}