export default function socketNodes(socket) {
    const originalRelayMessage = socket.relayMessage.bind(socket)

    Object.defineProperty(socket, 'relayMessage', {
        value: async function(jid, message, opts = {}) {
            const bizNode = {
                tag: 'biz',
                attrs: {},
                content: [{
                    tag: 'interactive',
                    attrs: { type: 'native_flow', v: '1' },
                    content: [{
                        tag: 'native_flow',
                        attrs: { v: '9', name: 'mixed' }
                    }]
                }]
            }

            const hasBizNode = (opts.additionalNodes || []).some(n => n.tag === 'biz')
            
            const mergedOpts = {
                ...opts,
                additionalNodes: hasBizNode 
                    ? (opts.additionalNodes || [])
                    : [...(opts.additionalNodes || []), bizNode]
            }

            // زيد BIZ attribute مباشرة في الـ message نفسه
            if (message) {
                const msgKey = Object.keys(message)[0]
                if (msgKey && message[msgKey]) {
                    if (!message[msgKey].contextInfo) {
                        message[msgKey].contextInfo = {}
                    }
                }
            }

            return await originalRelayMessage(jid, message, mergedOpts)
        },
        enumerable: true,
        configurable: true,
        writable: true
    })

    return socket
}
