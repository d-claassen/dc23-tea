/**
 * WordPress dependencies.
 */
import { useBlockProps } from '@wordpress/block-editor';
const { useSelect } = require( '@wordpress/data' );

/**
 * Internal dependencies.
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @param {Object} props
 * @param {Object} props.context
 * @param {number} props.context.postId
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
function Content( { context: { postId } } ) {
	const { name } = useSelect(
		( select ) => {
			const { getEntityRecord, getEditedEntityRecord } =
				select( 'core' );

			const originalEvent = getEntityRecord(
				'postType',
				'tribe_events',
				postId
			);
			const event = getEditedEntityRecord(
				'postType',
				'tribe_events',
				postId
			);
			const { _EventOrganizerID } = event?.meta;
			const organizer = getEntityRecord(
				'postType',
				'tribe_organizer',
				_EventOrganizerID
			);

			return {
				name: organizer?.title.rendered,
			};
		},
		[ postId ]
	);

	return <div { ...useBlockProps() }>{ name }</div>;
}
function Placeholder() {
	return <div { ...useBlockProps() }>Organizer</div>;
}

export default function Edit( { context } ) {
	const { postType, postId } = context;
	
	if ( postType !== 'tribe_events' ) {
		return null;
	}

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
