import {
	Button,
	DateTimePicker,
	DatePicker,
	Dropdown,
	FormToggle,
	TextControl,
	PanelBody,
	__experimentalToolsPanel as ToolsPanel,
	__experimentalToolsPanelItem as ToolsPanelItem,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';
import { useEntityProp } from '@wordpress/core-data';
import { dateI18n, getDate } from '@wordpress/date';
import { useMemo } from '@wordpress/element';
const { useSelect } = require( '@wordpress/data' );
const { PluginDocumentSettingPanel } = require( '@wordpress/editor' );
const { registerPlugin } = require( '@wordpress/plugins' );

const PostPanelRow = ( { className, label, children } ) => {
	return (
		<HStack className={ 'editor-post-panel__row ' + className }>
			{ label && (
				<div className="editor-post-panel__row-label">{ label }</div>
			) }
			<div className="editor-post-panel__row-control">{ children }</div>
		</HStack>
	);
};

const DropdownDateTimePicker = ( {
	date,
	setDate,
	buttonLabel = 'Select date',
	hasTimePicker = true,
} ) => {
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

const DC23TeaExtendedPanel = () => {
	const { postId, postType } = useSelect( ( select ) => {
		const store = select( 'core/editor' );

		return {
			postType: store.getCurrentPostType(),
			postId: store.getCurrentPostId(),
		};
	}, [] );

	const [ meta, updateMeta ] = useEntityProp(
		'postType',
		postType,
		'meta',
		postId
	);

	const oldMeta = useMemo( () => {
		// console.log( 'memoize meta' );
		return meta;
	}, [ postType, postId ] );

	if ( 'tribe_events' !== postType ) {
		return null;
	}

	const {
		_EventAllDay, // boolean
		_EventStartDate, // string, YYYY-MM-DD HH:mm:ss, local tz
		// _EventStartDateUTC, // string, YYYY-MM-DD HH:mm:ss, UTC
		_EventEndDate, // string, YYYY-MM-DD HH:mm:ss, local tz
		// _EventEndDateUTC, // string, YYYY-MM-DD HH:mm:ss, UTC
		_EventDateTimeSeparator, // string
		_EventTimeRangeSeparator, // string
	} = meta;

	const startDate = getDate( _EventStartDate );
	const startLabel = _EventAllDay
		? dateI18n( 'F j, Y', startDate )
		: dateI18n( 'F j, Y H:i', startDate );

	const endDate = getDate( _EventEndDate );
	const endLabel = _EventAllDay
		? dateI18n( 'F j, Y', endDate )
		: dateI18n( 'F j, Y H:i', endDate );

	return (
		<PluginDocumentSettingPanel
			name="dc23-tea-extended-panel"
			title="The Event Attendee"
		>
			<VStack spacing={ 1 }>
				<PostPanelRow label="Is all day event" className="">
					<Button
						variant="tertiary"
						onClick={ () =>
							updateMeta( {
								...meta,
								_EventAllDay: ! _EventAllDay,
							} )
						}
					>
						<FormToggle
							checked={ _EventAllDay }
							// Disable tab focus and mouse events to make the button the interaction point.
							style={ { pointerEvents: 'none' } }
							tabIndex={ -1 }
						/>
					</Button>
				</PostPanelRow>
				<PostPanelRow label="Start date" className="">
					<DropdownDateTimePicker
						date={ _EventStartDate }
						setDate={ ( newDate ) =>
							updateMeta( { ...meta, _EventStartDate: newDate } )
						}
						buttonLabel={ startLabel }
						hasTimePicker={ ! _EventAllDay }
					/>
				</PostPanelRow>

				<PostPanelRow label="End date" className="">
					<DropdownDateTimePicker
						date={ _EventEndDate }
						setDate={ ( newDate ) =>
							updateMeta( { ...meta, _EventEndDate: newDate } )
						}
						buttonLabel={ endLabel }
						hasTimePicker={ ! _EventAllDay }
					/>
				</PostPanelRow>
			</VStack>

			<ToolsPanel
				label="Advanced date"
				resetAll={ () =>
					updateMeta( {
						...meta,
						_EventDateTimeSeparator: oldMeta._EventDateTimeSeparator,
						_EventTimeRangeSeparator: oldMeta._EventTimeRangeSeparator,
					} )
				}
			>
				<ToolsPanelItem
					label="Date time separator"
					hasValue={ () => oldMeta._EventDateTimeSeparator !== _EventDateTimeSeparator }
				>
					<TextControl
						__nextHasNoMarginBottom
						label="Date time separator"
						value={ _EventDateTimeSeparator }
						onChange={ ( separator ) =>
							updateMeta( { ...meta, _EventDateTimeSeparator: separator } )
						}
					/>
				</ToolsPanelItem>

				<ToolsPanelItem
					label="Date range separator"
					hasValue={ () => oldMeta._EventTimeRangeSeparator !== _EventTimeRangeSeparator }
				>
					<TextControl
						__nextHasNoMarginBottom
						label="Date range separator"
						value={ _EventTimeRangeSeparator }
						onChange={ ( separator ) =>
							updateMeta( {
								...meta,
								_EventTimeRangeSeparator: separator,
							} )
						}
					/>
				</ToolsPanelItem>
			</ToolsPanel>

			<PanelBody title="Location" initialOpen={ false } />
			<PanelBody title="Organizers" initialOpen={ false } />
			<PanelBody title="Event website" initialOpen={ false } />
		</PluginDocumentSettingPanel>
	);
};

registerPlugin( 'dc23-tea-extended', { render: DC23TeaExtendedPanel } );
