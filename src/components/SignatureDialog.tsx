onChange={e => setNewTagInput(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/^-+|-+$/g, ''))}
