import { Button, Dropdown, ComboboxControl } from '@wordpress/components';
import { debounce } from '@wordpress/compose';
import { useState } from '@wordpress/element';

/**
 * Dropdown element to select a wp_post from any post_type.
 *
 * @param {Object}   props
 * @param {string}   props.buttonLabel
 * @param {string}   props.inputLabel
 * @param {string}   props.value
 * @param {Object[]} props.options
 * @param {Function} props.onChange
 * @param {Function} props.onSearch
 *
 * @return {Element} The dropdown.
 */
export function DropdownPostSelect( {
	buttonLabel,
	inputLabel = '',
	value,
	options: posts,
	onChange,
	onSearch = () => {},
} ) {
	const [ selected, setSelected ] = useState( value );

	const options = [];
	if ( Array.isArray( posts ) ) {
		posts.forEach( ( post ) => {
			options.push( {
				value: post.id,
				label: post.title.rendered,
				disabled: false,
			} );
		} );
	}

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
			renderContent={ () => (
				<ComboboxControl
					label={ inputLabel }
					value={ selected }
					options={ options }
					onChange={ setSelected }
					onFilterValueChange={ debounce( onSearch, 300 ) }
					allowReset={ true }
					isLoading={ false }
				/>
			) }
			onClose={ () => {
				onChange( selected );
			} }
		/>
	);
}
