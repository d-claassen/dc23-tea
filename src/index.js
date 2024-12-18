import { Button, DateTimePicker, Dropdown, BaseControl, useBaseControlProps,
	PanelBody, PanelRow,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
const { useSelect } = require( '@wordpress/data' );
const { PluginDocumentSettingPanel } = require( '@wordpress/edit-post' );
const { registerPlugin } = require( '@wordpress/plugins' );

const DropdownDateTimePicker = ( {
	date,
	setDate,
	buttonLabel = 'Select date',
	help = "",
	label = "Date"
} ) => {
	const { baseControlProps, controlProps } = useBaseControlProps( { label, help } );

	return (
		<Dropdown
			popoverProps={ {
				position: 'bottom left left'
		} }
			renderToggle={ ( { isOpen, onToggle } ) => (
				<BaseControl { ...baseControlProps } __nextHasNoMarginBottom>
					<Button variant="link" onClick={ onToggle } aria-expanded={ isOpen } { ...controlProps }>
						{ buttonLabel }
					</Button>
				</BaseControl>
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



const DC23TeaExtendedPanel = () => {
	const postType = useSelect( select => select( 'core/editor' ).getCurrentPostType() );
	const postId = useSelect( select => select( 'core/editor' ).getCurrentPostId() );

	const [ meta, updateMeta ] = useEntityProp(
		'postType',
		postType,
		'meta',
		postId
	);

	if ( 'tribe_events' !== postType ) {
		return null;
	}

	const {
		_EventAllDay, // boolean
		_EventStartDate, // string, YYYY-MM-DD HH:mm:ss, local tz
		_EventStartDateUTC, // string, YYYY-MM-DD HH:mm:ss, UTC
		_EventEndDate, // string, YYYY-MM-DD HH:mm:ss, local tz
		_EventEndDateUTC, // string, YYYY-MM-DD HH:mm:ss, UTC
		_EventDateTimeSeparator, // string
		_EventTimeRangeSeparator, // string
	} = meta;

	return(
		<PluginDocumentSettingPanel
			name="dc23-tea-extended-panel"
			title="The Event Attendee"
		>
			<PanelRow>
				<DropdownDateTimePicker
					label={ "Start date" }
					date={ _EventStartDate }
					setDate={ ( newDate ) =>
						updateMeta( { ...meta, _EventStartDate: newDate } )
					}
					buttonLabel={ _EventStartDate }
				/>
			</PanelRow>

			<PanelRow>
				<DropdownDateTimePicker
					label={ "End date" }
					date={ _EventEndDate }
					setDate={ ( newDate ) =>
						updateMeta( { ...meta, _EventEndDate: newDate } )
					}
					buttonLabel={ _EventEndDate }
				/>
			</PanelRow>
			<PanelBody title="Location" initialOpen={ false } />
			<PanelBody title="Organizers" initialOpen={ false } />
			<PanelBody title="Event website" initialOpen={ false } />

		</PluginDocumentSettingPanel>
	);
}
registerPlugin( 'dc23-tea-extended', { render: DC23TeaExtendedPanel } );
