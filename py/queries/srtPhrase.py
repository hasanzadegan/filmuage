def get_phrase_by_subject_query():
    return '''
        SELECT sf.FileName, sp.StartTime, sp.EndTime, sp.GUID, sp.Phrase
        FROM SRTFiles sf
        JOIN SRTPhrases sp ON sf.ID = sp.SRTFileID
        JOIN PhraseList pl ON pl.SRTPhraseID = sp.ID
        JOIN subjects sb ON sb.SubjectID = pl.SubjectID
        WHERE sb.SubjectName = %s
    '''

def get_phrase_like_title_query():
    return '''
        SELECT sf.FileName, sp.StartTime, sp.EndTime, sp.GUID, sp.Phrase
        FROM SRTFiles sf
        JOIN SRTPhrases sp ON sf.ID = sp.SRTFileID
        WHERE sp.Phrase LIKE '%% %s %%'
    '''

