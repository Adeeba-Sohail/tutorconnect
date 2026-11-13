import { getInitials } from '../utils/format.js';

// Shows the tutor's photo when there is one; otherwise (or if the image fails)
// shows their initials, so a missing image never leaves a gap.
export default function Avatar({ name, photo, size = 'medium' }) {
  return (
    <span className={`avatar avatar-${size}`} role="img" aria-label={`Profile picture placeholder for ${name}`}>
      {photo ? (
        <img src={photo} alt="" onError={(event) => event.currentTarget.remove()} />
      ) : null}
      <span aria-hidden="true">{getInitials(name)}</span>
    </span>
  );
}
