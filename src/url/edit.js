/**
 * WordPress dependencies.
 */
import { useBlockProps } from '@wordpress/block-editor';
import { useEntityProp } from '@wordpress/core-data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import './editor.scss';


/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
function Content( { context:  { postType, postId } } ) {
	const [ meta ] = useEntityProp( 'postType', postType, 'meta', postId );

	const url = meta?._EventURL;

	return (
		<div { ...useBlockProps() }>
			<a href={ url }>{ url }</a>
		</div>
	);
}

function Placeholder() {
	return (
		<div { ...useBlockProps() }>
			<a href="https://example.org">https://example.org</a>
		</div>
	);
}

export default function Edit( { context } ) {
	const { postType, postId } = context;

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
