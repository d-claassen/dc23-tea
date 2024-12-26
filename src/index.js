import {
	Button, DateTimePicker, DatePicker, Dropdown,
	BaseControl, useBaseControlProps,
	CheckboxControl, ToggleControl,
	TextControl,
	PanelBody, PanelRow,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
const { useSelect } = require( '@wordpress/data' );
const { PluginDocumentSettingPanel } = require( '@wordpress/editor' );
const { registerPlugin } = require( '@wordpress/plugins' );
import { dateI18n, getDate } from '@wordpress/date';

const DropdownDateTimePicker = ( {
	date,
	setDate,
	buttonLabel = 'Select date',
	help = "",
	label = "Date",
	hasTimePicker = true,
} ) => {
	const { baseControlProps, controlProps } = useBaseControlProps( { label, help } );

	const PickerComponent = hasTimePicker ? DateTimePicker : DatePicker;

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

	const startDate = getDate( _EventStartDate );
	let startLabel = _EventAllDay ? dateI18n( 'F j, Y', startDate ) : dateI18n( 'F j, Y H:i', startDate );

	const endDate = getDate( _EventEndDate );
	let endLabel = _EventAllDay ? dateI18n( 'F j, Y', endDate ) : dateI18n( 'F j, Y H:i', endDate );

	return(
		<PluginDocumentSettingPanel
			name="dc23-tea-extended-panel"
			title="The Event Attendee"
		>
			<PanelRow>
				<ToggleControl
					__nextHasNoMarginBottom
					label="Is all day event"
					checked={ _EventAllDay }
					onChange={ ( isAllDay ) =>
						updateMeta( { ...meta, _EventAllDay: isAllDay } ) }
				/>
			</PanelRow>
			<PanelRow>
				<DropdownDateTimePicker
					label={ "Start date" }
					date={ _EventStartDate }
					setDate={ ( newDate ) =>
						updateMeta( { ...meta, _EventStartDate: newDate } )
					}
					buttonLabel={ startLabel }
					hasTimePicker={ !_EventAllDay }
				/>
			</PanelRow>

			<PanelRow>
				<DropdownDateTimePicker
					label={ "End date" }
					date={ _EventEndDate }
					setDate={ ( newDate ) =>
						updateMeta( { ...meta, _EventEndDate: newDate } )
					}
					buttonLabel={ endLabel }
					hasTimePicker={ !_EventAllDay }
				/>
			</PanelRow>
			<PanelBody title="Advanced" initialOpen={ false }>
				<PanelRow>
					<TextControl
						__nextHasNoMarginBottom
						label="Date time separator"
						value={ _EventDateTimeSeparator }
						onChange={ ( separator ) =>
							updateMeta( {...meta, _EventDateTimeSeparator: separator})}
					/>
				</PanelRow>
				<PanelRow>
					<TextControl
						__nextHasNoMarginBottom
						label="Date range separator"
						value={ _EventTimeRangeSeparator }
						onChange={ ( separator ) =>
							updateMeta( { ...meta, _EventTimeRangeSeparator: separator } ) }
					/>
				</PanelRow>
			</PanelBody>
			<PanelBody title="Location" initialOpen={ false } />
			<PanelBody title="Organizers" initialOpen={ false } />
			<PanelBody title="Event website" initialOpen={ false } />

		</PluginDocumentSettingPanel>
	);
}
registerPlugin( 'dc23-tea-extended', { render: DC23TeaExtendedPanel } );
