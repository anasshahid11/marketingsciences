export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const data = req.body;
        const formspreeUrl = process.env.FORMSPREE_URL;

        if (!formspreeUrl) {
            console.error('FORMSPREE_URL environment variable is not set');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Add a dynamic subject to prevent email grouping/threading
        // This ensures each submission appears as a separate conversation in your inbox
        const timestamp = new Date().toLocaleString();
        data['_subject'] = `New Project Request: ${data.name || 'Unknown'} - ${timestamp}`;

        // Forward to Formspree
        const response = await fetch(formspreeUrl, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok) {
            return res.status(200).json(result);
        } else {
            return res.status(response.status).json(result);
        }
    } catch (error) {
        console.error('Submission error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
