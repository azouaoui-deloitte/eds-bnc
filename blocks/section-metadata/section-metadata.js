/**
 * Applies authored section metadata to the parent section.
 * @param {Element} block The metadata table.
 */
export default function decorate(block) {
  const section = block.closest('.section');
  if (section) {
    [...block.children].forEach((row) => {
      const [key, value] = [...row.children].map((cell) => cell.textContent.trim().toLowerCase());
      if (key === 'style' && value) section.classList.add(...value.split(/\s+/));
    });
  }
  block.remove();
}
