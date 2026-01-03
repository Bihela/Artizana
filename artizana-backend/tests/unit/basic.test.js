describe('Basic Unit Test', () => {
    it('should perform basic math', () => {
        expect(1 + 1).toBe(2);
    });

    it('should handle strings', () => {
        const str = 'Artizana';
        expect(str).toContain('Art');
    });
});
